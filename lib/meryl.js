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
	req.addListener('data', function (data) {
		req.data = data;
	}).addListener('end', function () {
		var ctx = url.parse(req.url);
		ctx.headers = {'Content-Type': 'text/html'};
		ctx.status = 200;		
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
				ctx.merge(match);
				if (!logic[i].cb.call(ctx, req, resp)) {
					break;
				}
			}
		}
		if(matched) {
			resp.writeHead(ctx.status, ctx.headers);
			sys.debug(offset);
			resp.write(buffer.toString('utf-8', 0, offset), 'utf-8');
			resp.end();
		} else {
			resp.writeHead(404, {});
			resp.write("not found");
			resp.end();
		}
	});
};
