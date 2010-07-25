var sys = require('sys'),
	url = require('url');
	
Object.prototype.merge = function (obj) {
	for (var key in obj) {
		this[key] = obj[key];
	}
	return this;
};

var logic = [],
	infra = [],
	notFndHnd = function() {
		return '<h3>Not Found</h3><pre>' + this.pathname + '</pre>';
	},
	errHnd = function(e) { 
		return '<h3>Server error</h3><pre>' 
			+ ((e instanceof Error) ? e.stack : e)
			+ '</pre>'
	};

exports.h = function (pattern, cb) {
	logic.push({pattern: pattern, cb: cb});
};

exports.p = function (pattern, cb) {
	infra.push({pattern: pattern, cb: cb});
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

function matchHandler (ctx, req, resp, precb, postcb) {
	if (logic.length) {
		var parts = null;
		for (var i = 0; i < logic.length; i++) {
			parts = parsePath(logic[i].pattern, req.method + ' ' + ctx.pathname);
			if (parts) {
				if((!precb || (precb && precb.call(ctx))) && logic[i].cb) {
					var output = logic[i].cb.call(ctx.merge(parts), req, resp)
					if(postcb) {
						postcb.call(ctx, output);
					}
				}
				return true;
			} 
		}
	} else {
		throw new Error("At least one handler must defined");
	}
	return false;
}

function matchPlugin (ctx, req, resp, cb) {
	var chainOK = true;
	for (var j = 0; j < infra.length; j++) {
		var parts = parsePath(infra[j].pattern, req.method + ' ' + ctx.pathname);
		if (parts) {
			if(cb && !cb(ctx)) {
				return false;
			}
			chainOK = chainOK && 
				infra[j].cb.call(ctx.merge(parts), req, resp);
			if (!chainOK) {
				break;
			}
		}
	}
	return chainOK;
}

exports.cgi = function (req, resp) {
	var buffer = null;
	var ctx = url.parse(req.url);
	ctx.headers = {'Content-Type': 'text/html'};
	req.addListener('data', function (data) {
		ctx.postdata = data;
	}).addListener('end', function () {
		try {
			if (!matchHandler(ctx, req, resp,
				function() {
					return matchPlugin(ctx, req, resp);
				},
				function(output) {
					buffer = output;
				}
			)) {
				if(notFndHnd) {
					ctx.status = 404;
					buffer = notFndHnd.call(ctx, req, resp);
				}
			}
		} catch (e) {
			if (errHnd) {
				ctx.status = 500;
				buffer = errHnd.call(ctx, e, req, resp); 
			} else {
				throw e;
			}
		} finally {
			resp.writeHead(ctx.status || 200, ctx.headers);
			resp.end(buffer || '', 'utf-8');
		}
	});
};
