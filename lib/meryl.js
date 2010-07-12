var sys = require('sys'),
	url = require('url');

var logic = [];

var parsePathExpr = function(expr, path) {
	var regex = new RegExp("\<([^>]*)\>", "gi"),
		keys = [],
		values = null,
		capture = null;
	while(capture = regex.exec(expr)) {
		keys.push(capture[1]);
	}
	regex = new RegExp(expr.replace("\.", "\\.", "gi").
					replace("\?", "\\?", "gi").
					replace(regex, "([^\/\.\?]*)", "gi"), "gi")
	if(values = regex.exec(path)) {
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

exports.cgi = function(req, resp) {
	var parts = url.parse(req.url, true);
	for(var pattern in logic) {
		var handler = logic[pattern];
		var cmd = req.method + ' ' + parts.pathname;
		var pathParams = parsePathExpr(pattern, cmd);
		if(pathParams) {
			parts.pathParams = pathParams;
			handler({'req': req, 'resp': resp, 'parts': parts});
			return;
		}
	}	
	resp.writeHead(404, {'Content-Type': 'text/html'});
	resp.write('<h1>Document Not Found</h1>');
	resp.end();
};

exports.h = function(pattern, handler) {
	logic[pattern] = handler;
};
