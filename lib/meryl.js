var sys = require('sys'),
	url = require('url'),
	Buffer = require('buffer').Buffer;
	
Object.prototype.merge = function (obj) {
	for (var key in obj) {
		this[key] = obj[key];
	}
	return this;
};

var matchPath = function (expr, path) {
	var regex = /{([^}]*)}/gi,
		keys = [],
		values = null,
		capture = null;
	while (capture = regex.exec(expr)) {
		keys.push(capture[1]);
	}
	var regexA = new RegExp("^" + expr.replace(regex, "(.*)", "gi") + "$");
	if (values = regexA.exec(path)) {
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

var logic = [];

exports.h = function (pattern, cb) {
	logic.push({pattern: pattern, cb: cb});
};

var buffer = new Buffer(1024 * 1024 * 5);

exports.cgi = function (req, resp) {
	var ctx = url.parse(req.url);
	req.addListener('data', function (data) {
		ctx.data = data;
	}).addListener('end', function () {
		ctx.headers = {'Content-Type': 'text/html'};
		var offset = 0;
		ctx.send = function (data) {
			var datalen = Buffer.byteLength(data, 'utf-8');
			buffer.write(data, offset, 'utf-8');
			offset += datalen;
		};
		var matched = false;
		for (var i = 0; i < logic.length; i++) {
			var match = matchPath(logic[i].pattern, req.method + ' ' + ctx.pathname);
			if (match) {
				if(!matched) matched = true;
				try {
					if (!logic[i].cb.call(match.merge(ctx), req, resp)) {
						break;
					}
				} catch (e) {
					resp.writeHead(ctx.status || 500, ctx.headers);
					resp.write('<h3>Server Error</h3>');
					resp.write('<p>' + e.message + '</p>');
					resp.write('<pre>' + e.stack + '</pre>');
					resp.end();
				}
			}
		}
		if(matched) {
			resp.writeHead(ctx.status || 200, ctx.headers);
			resp.write(buffer.toString('utf-8', 0, offset), 'utf-8');
			resp.end();
		} else {
			resp.writeHead(ctx.status || 404, {});
			resp.write('<h3>Document Not found</h3>');
			resp.end();
		}
	});
};
