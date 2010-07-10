var sys = require('sys'),
	url = require('url');

var logic = [];

exports.cgi = function(req, resp) {
	var parts = url.parse(req.url, true);
	for(var pattern in logic) {
		var handler = logic[pattern];
		var cmd = req.method + ' ' + parts.pathname;
		var captures;
		if((captures = new RegExp(pattern).exec(cmd))) {
			handler({'req': req,
						'resp': resp,
						'parts': parts,
						'captures': captures
					});
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
