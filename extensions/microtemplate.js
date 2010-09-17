/*!
 * Meryl
 * Copyright(c) 2010 Kadir Pekel.
 * MIT Licensed
 */

/*
 * Modules dependencies
 */
var fs = require('fs'),
  path = require('path');

/*
 * This method is a John Ressig's micro templating
 * implementation of underscore.js
 *
 * @param {Object} opts
 * @return {Function}
 * @api private
 */
var proc = function (str, data) {
  var data = data || {};
  var endMatch = new RegExp("'(?=[^\%]*\%\>)", "g");
  return new Function('obj',
    'var p=[],print=function(){p.push.apply(p,arguments);};'
    + 'with(obj||{}){p.push(\''
    + str.replace(/\r/g, '\\r')
      .replace(/\n/g, '\\n')
      .replace(/\t/g, '\\t')
      .replace(endMatch, "✄")
      .split("'")
      .join("\\'")
      .split("✄")
      .join("'")
      .replace(/<%=(.+?)%>/g, "',$1,'")
      .split("<%")
      .join("');")
      .split("\%\>")
      .join("p.push('")
    + "');}return p.join('');")(data);
};

/*
 * Creates an extension callback for rendering templates
 * for a given data context
 *
 * @param {Object} opts
 * @return {Function}
 * @api public
 */
module.exports = function(opts) {
  var opts = opts || {};
  var templateDir = opts.templateDir || 'templates';
  var templateExt = opts.templateExt || 'jshtml';
  var x = function (templateName, data) {
    var self = this;
    self.response.writeHead(self.status, self.headers);
    var template = function (templateName2, data2, root) {
      var src = fs.readFileSync(path.join(templateDir, templateName2 + '.' + templateExt), 'utf-8');
      var output = proc(src.toString(), data2);
      if (!root) {
        return output;
      } else {
        if (src) {
          self.response.write(output, 'utf-8');
          self.response.end();
        }
      }
    };
    data.template = template;
    template(templateName, data, true);
  }
  return x;
}
