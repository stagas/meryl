var sys = require('sys'),
	url = require('url');
	
Object.prototype.merge = function (obj) {
	for (var key in obj) {
		this[key] = obj[key];
	}
	return this;
};

var handlers = [],
	plugins = [],
	notFndHnd = function() {
		return '<h3>Not Found</h3><pre>' + this.pathname + '</pre>';
	},
	errHnd = function(e) { 
		return '<h3>Server error</h3><pre>' 
			+ ((e instanceof Error) ? e.stack : e)
			+ '</pre>'
	};

exports.h = function (pattern, cb) {
	handlers.push({pattern: pattern, cb: cb});
};

exports.p = function (pattern, cb) {
	plugins.push({pattern: pattern, cb: cb});
};

exports.err = function (cb) {
	errHnd = cb;
};

exports.notFound = function (cb) {
	notFndHnd = cb;
};

var parsePath = function (expr, path) {
	var p1 = "{([^}]+)}",
		p2 = "<([^>]+)>",
		rA = new RegExp("(?:" + p1 + ")|(?:"+ p2 + ")", "gi"),
		keys = [],
		values = null,
		capture = null;
	while (capture = rA.exec(expr)) {
		keys.push(capture[1] || capture[2]);
	}
	var rB = new RegExp("^" + expr
		.replace(/\(/, "(?:", "gi")
		.replace(/(\.|\?)/, '\\$1', "gi")
		.replace(new RegExp(p1), "([^/\.\?]+)", "gi")
		.replace(new RegExp(p2), "(.+)", "gi") + "$")
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

function proc(infra, ctx, req, resp) {
	// Default content-type
	ctx.headers['Content-Type'] = 'text/html';
	var i = 0;
	function chain() {
		var procunit = infra[i++];
		if(procunit && procunit.pattern) {
			var parts = parsePath(procunit.pattern,
						req.method + ' ' + ctx.params.pathname);
			if(parts) {
				if(procunit.cb) {
					ctx.params.merge(parts);
					procunit.cb.call(ctx, req, resp, chain);
				}
			} else {
				chain();
			}
		}
	}
	chain();
}

// main entry point
exports.cgi = function(opts) {
	var opts = opts || {};
	var infra = plugins.concat(handlers);
	return function (req, resp) {
		var ctx = {
			params: url.parse(req.url),
			headers: {},
			status: 200,
			send: function(data, enc) {
				resp.writeHead(this.status, this.headers);
				resp.end(data, enc || 'utf-8');
			}
		}
		req.addListener('data', function (data) {
			ctx.postdata = data;
		}).addListener('end', function () {
			proc(infra, ctx, req, resp);
		});
	};
}
