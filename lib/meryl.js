var sys = require('sys'),
	url = require('url');

var infra = [],
	logic = [];

Object.prototype.merge = function (obj) {
	for(var key in obj) {
		this[key] = obj[key];
	}
	return this;
}

var parsePath = function(expr, path) {
	var regex = new RegExp("<([^>]*)>", "gi"),
		regexW = new RegExp("{([^}]*)}", "gi"), 
		keys = [],
		values = null,
		capture = null;
	while(capture = regex.exec(expr) || regexW.exec(expr)) {
		keys.push(capture[1]);
	}
	var regexA = new RegExp("^" + expr
		.replace(regex, "([^\/\.\?]*)", "gi")
		.replace(regexW, "(.*)", "gi") + "$", "gi");
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
	var parts = url.parse(req.url, true).merge(parts);
	var cmd = req.method + ' ' + parts.pathname;
	var headers = { 'Content-Type': 'text/html' };
	function respond(content, status) {
		resp.writeHead(status || 200, headers);
		resp.write(content);
		resp.end();
	}
	req.addListener('data', function (postdata) {
		parts.data = postdata;
	})
	.addListener('end', function () {
		var pCtx = { headers: headers }.merge(parts);
		try {
			for(var i = 0; i < infra.length; i++) {
				var pathParams = parsePath(infra[i].pattern, cmd);
				if(pathParams) { 
					if(!infra[i].cb.call(pCtx.merge(pathParams))) {
						break;
					}
				}
			}
			var hCtx = { headers: headers }.merge(parts);
			for(var i = 0; i < logic.length; i++) {
				var pathParams = parsePath(logic[i].pattern, cmd);
				if(pathParams) {
					respond(logic[i].cb.call(hCtx.merge(pathParams)));
					return;
				}
			}
		} catch(e) {
			respond('<h1>Server Error</h1><pre>' + e.message + '\n\n' + e.stack + '</pre>',
					e.status || 500);
			return;
		}
		respond('<h1>Document Not Found</h1>', 404);
	});
};

exports.h = function(pattern, cb) {
	logic.push({"pattern" : pattern, "cb": cb});
};

exports.p = function(pattern, cb) {
	infra.push({"pattern" : pattern, "cb": cb});
};
