var sys = require('sys'),
	url = require('url');

var infra = [];
var logic = [];

Object.prototype.merge = function (obj) {
	for(var key in obj) {
		this[key] = obj[key];
	}
	return this;
}

var parsePathExpr = function(expr, path) {
	var regex = new RegExp("<([^>]*)>", "gi"),
		regexW = new RegExp("{([^}]*)}", "gi"), 
		keys = [],
		values = null,
		capture = null;
	while(capture = regex.exec(expr) || regexW.exec(expr)) {
		keys.push(capture[1]);
	}
	var regexA = new RegExp(expr.replace("\.", "\\.", "gi").
					replace("\?", "\\?", "gi").
					replace(regex, "([^\/\.\?]*)", "gi").
					replace(regexW, "(.*)", "gi"), "gi");
					
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

exports.cgi = function(req, resp) {
	var parts = url.parse(req.url, true);
	var cmd = req.method + ' ' + parts.pathname;
	var headers = { 'Content-Type': 'text/html' };
	var pCtx = { headers: headers }.merge(parts);
	try {
		for(var i = 0; i < infra.length; i++) {
			var pathParams = parsePathExpr(infra[i].pattern, cmd);
			if(pathParams) { 
				if(!infra[i].cb.call(pCtx.merge(pathParams))) {
					break;
				}
			}
		}
	
		var hCtx = { headers: headers }.merge(parts);
		for(var i = 0; i < logic.length; i++) {
			var pathParams = parsePathExpr(logic[i].pattern, cmd);
			if(pathParams) {
				var content = logic[i].cb.call(hCtx.merge(pathParams));
				resp.writeHead(200, hCtx.headers);
				resp.write(content);
				resp.end();
				return;
			}
		}
	} catch(e) {
		resp.writeHead(e.status || 500, headers);
		resp.write('<h1>Server Error</h1>');
		resp.write('<pre>' + e.message + '</pre>');
		resp.write('<pre>' + e.stack + '</pre>');
		resp.end();	
	}
	
	resp.writeHead(404, headers);
	resp.write('<h1>Document Not Found</h1>');
	resp.end();
};

exports.h = function(pattern, cb) {
	logic.push({"pattern" : pattern, "cb": cb});
};

exports.p = function(pattern, cb) {
	infra.push({"pattern" : pattern, "cb": cb});
};

