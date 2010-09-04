var fs = require('fs'),
  path = require('path');

// This method is a Joe Ressig's micro templating implementation of underscore.js 

var proc = function (str, data) {
  var endMatch = new RegExp("'(?=[^\%]*\%\>)", "g");
  var fn = new Function('obj',
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
    + "');}return p.join('');");
  return data ? fn(data) : fn;
};

module.exports = function(opts) {
  var opts = opts || {};
  var templateDir = opts.templateDir || 'templates';
  var templateExt = opts.templateExt || 'jshtml';
  var x = function (templateName, data) {
    var self = this;
    self.response.writeHead(self.status, self.headers);
    var template = function (templateName2, data2, root) {
      var src = fs.readFileSync(path.join(templateDir, templateName2 + '.' + templateExt), 'utf-8');
      if (src) {
        self.response.write(proc(src.toString(), data2), 'utf-8');
        if (root)
          self.response.end();
      }
    };
    var data = data || {};
    data.template = template;
    template(templateName, data, true);
  }
  return x;
}
