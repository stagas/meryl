var sys = require('sys'),
	url = require('url');

var infra = [];
var logic = [];

Object.prototype.merge = function (obj) {
	for(var key in obj) {
		this[key] = obj[key];
	}		
}

var parsePathExpr = function(expr, path) {
	var regex = new RegExp("<([^>]*)\*?>", "gi"),
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
	var ctx = { headers: {'Content-Type': 'text/html'} };
	ctx.merge(url.parse(req.url, true));
	for(var pattern in logic) {
		var handler = logic[pattern];
		var cmd = req.method + ' ' + ctx.pathname;
		var pathParams = parsePathExpr(pattern, cmd);
		if(pathParams) {
			ctx.merge(pathParams);
			try {
				for(var name in infra) {
					var plugin = infra[name];
					if(!plugin.call(ctx)) {
						break;
					}
				}
				var content = handler.call(ctx);
				resp.writeHead(200, ctx.headers);
				resp.write(content);
				resp.end();
			} catch(e) {
				resp.writeHead(500, {'Content-Type': 'text/html'});
				resp.write('<h1>Server Error</h1>');
				resp.write('<pre>' + JSON.stringify(e, null, "\t") + '</pre>');
				resp.end();	
			}
			return;
		}
	}	
	resp.writeHead(404, {'Content-Type': 'text/html'});
	resp.write('<h1>Document Not Found</h1>');
	resp.end();
};

exports.h = function(pattern, cb) {
	logic[pattern] = cb;
};

exports.p = function(name, cb) {
	infra[name] = cb;
};

