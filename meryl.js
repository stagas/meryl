/*!
 * Meryl
 * Copyright(c) 2010 Kadir Pekel.
 * MIT Licensed
 */

/*
 * Modules dependencies
 */
var sys = require('sys'),
    url = require('url');

/*
 * Variable definitions.
 */
var handlers = [],  // Handler registry
    plugins = [],  // Plugin registry
    extensions = [], // Extension Registry
    notFndHnd = function () { // Default 404 not found handler
      if (this.status >= 200 && this.status < 300) this.status = 404;
      this.send('<h3>Not Found</h3><pre>'
        + this.params.pathname
        + '</pre>');
    },
    errHnd = function (e) { // Default 500 error handler
      if (this.status >= 200 && this.status < 300) this.status = 500;
      this.send('<h3>Server error</h3><pre>'
        + ((e instanceof Error && !this.options.prod) ? e.stack : e)
        + '</pre>');
    };

/*
 * Handler registration function
 *
 * @param {String} pattern
 * @param {Function} cb
 * @return {undefined}
 * @api public
 */
exports.h = function (pattern, cb) {
  handlers.push({
    pattern: pattern,
    cb: cb
  });
};

/*
 * Plugin registration function
 *
 * @param {String} pattern
 * @param {Function} cb
 * @return {undefined}
 * @api public
 */
exports.p = function (pattern, cb) {
  plugins.push({
    pattern: pattern,
    cb: cb
  });
};

/*
 * Extension registration function
 *
 * @param {String} key
 * @param {Object} value
 * @return {undefined}
 * @api public
 */
exports.x = function (key, value) {
  extensions.push({
    key: key,
    value: value
  });
};

/*
 * Function for defining custom error handlers
 *
 * @param {Function} cb
 * @return {undefined}
 * @api public
 */
exports.errHnd = function (cb) {
  errHnd = cb;
};

/*
 * Function for defining custom resource not found handler
 *
 * @param {Function} cb
 * @return {undefined}
 * @api public
 */
exports.notFound = function (cb) {
  notFndHnd = cb;
};

/*
 * Parses path expression and extract path variables
 *
 * @param {String} expr
 * @param {String} path
 * @return {Object}
 * @api private
 */
var parsePath = function (expr, path) {
  var p1 = "{([^}]+)}",
      p2 = "<([^>]+)>",
      rA = new RegExp("(?:" + p1 + ")|(?:" + p2 + ")", "gi"),
      keys = [],
      values = null,
      capture = null;
  while (capture = rA.exec(expr)) {
    keys.push(capture[1] || capture[2]);
  }
  var rB = new RegExp("^"
    + expr.replace(/\(/, "(?:", "gi")
          .replace(/\./, "\\\.", "gi")
          .replace(/\*/, ".*", "gi")
          .replace(new RegExp(p1), "([^/\.\?]+)", "gi")
          .replace(new RegExp(p2), "(.+)", "gi")
    + "$");
  if (values = rB.exec(path)) {
    var result = {};
    values.shift();
    if (values.length == keys.length) {
      for (var i in keys) {
        result[keys[i]] = values[i];
      }
    }
    return result;
  }
  return null;
};

/*
 * Process incoming requests and do main routing
 * operations through handlers and plugins by chaining matched
 * ones with each other
 *
 * @param {Array} infra
 * @param {Object} ctx
 * @return {undefined}
 * @api private
 */
function proc(infra, ctx) {
  var i = 0;
  function chain() {
    var procunit = infra[i++];
    if (procunit && procunit.pattern) {
      var parts = parsePath(procunit.pattern, ctx.request.method
        + ' ' + ctx.params.pathname);
      if (parts) {
        if (procunit.cb) {
          for (var key in parts)
            ctx.params[key] = parts[key];
          for (var key in ctx.params.query)
            ctx.params[key] = ctx.params.query[key];
          ctx.params.query = undefined;
          procunit.cb.call(ctx, chain);
        }
      } else {
        chain();
      }
    }
  }
  try {
    chain();
  } catch (e) {
    if (errHnd) {
      errHnd.call(ctx, e);
    }
  }
}

/*
 * Main entry point of Meryl. It pushes some initial
 * preperations for handling http requests.
 *
 * Examples:
 *
 *  require('http').createServer(meryl.cgi({debug: 1})).listen(3000);
 *
 * @param {object} opts
 * @return {Function}
 * @api public
 */

exports.cgi = function (opts) {
  var opts = opts || {};
  var infra = plugins.concat(handlers);
  infra.push({
    pattern: "*",
    cb: notFndHnd
  });
  return function (req, resp) {
    var ctx = {
      params: url.parse(req.url, true),
      headers: {
        'Content-Type': 'text/html'
      },
      status: 200,
      send: function (data, enc) {
        resp.writeHead(this.status, this.headers);
        resp.end(data, enc || 'utf-8');
      },
      options: opts,
      request: req,
      response: resp
    };
    for (var i in extensions) {
      var extension = extensions[i];
      ctx[extension.key] = extension.value;
    }
    req.addListener('data', function (data) {
      ctx.postdata = data;
    }).addListener('end', function () {
      proc(infra, ctx);
    });
  };
}
