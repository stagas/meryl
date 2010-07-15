var sys = require('sys'),
  url = require('url');

Object.prototype.merge = function (obj) {
	for(var key in obj) {
		this[key] = obj[key];
	}
	return this;
}

var matchPath = function(expr, path) {
	var regex = /{([^}]*)}/gi, 
		keys = [],
		values = null,
		capture = null;
	while(capture = regex.exec(expr)) {
		keys.push(capture[1]);
	}
	var regexA = new RegExp("^" + expr
	  .replace(regex, "(.*)", "gi") + "$", "gi");
	if(values = regexA.exec(path)) {
		var result = {};
		values.shift();
		if(values.length == keys.length) {
			for(var i in keys) {
				result[keys[i]] = values[i];
			}
		}
		return result;
	}
	return null;
}

var logic = [];

exports.h = function(pattern, cb) {
	logic.push({"pattern" : pattern, "cb": cb});
};

exports.cgi = function(req, resp) {
  req.addListener('data', function(data) {
      req.data = data;
    }
  ).addListener('end', function() {
      req.params = url.parse(req.url);
      for(var i = logic.length - 1; i >= 0; i--) {
        var match = matchPath(logic[i].pattern,
          req.method + ' ' + req.params.pathname);
      		if(match) {
    	    	req.params.merge(match);
	  	      logic[i].cb(req, resp);
	        }
      }
    }
  );
}
