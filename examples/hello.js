require.paths.unshift('../lib');

var sys = require('sys'),
	http = require('http'),
	meryl = require('meryl');

meryl.h('GET /hello_world', function(ctx) {
	ctx.resp.writeHead(200, {'Content-Type': 'text/html'});
	ctx.resp.write('<h1>Hello, World!</h1>');
	ctx.resp.end();
});

http.createServer(meryl.cgi).listen(8080);

