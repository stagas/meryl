Meryl
=====
Minimalistic web framework for nodejs platform.

Usage
-----

Once you obtain the library, import 'meryl' by require

	var meryl = require('./lib/meryl');

Now you can use it simply like shown below

	// register a http handler
	meryl.h("GET /post/<pid>/comment/<cid>.html",
		function(ctx) {
			ctx.resp.writeHead(200, {'Content-Type': 'text/html'});
			ctx.resp.write('<h1>Hello, World!');
			ctx.resp.write(JSON.stringify(ctx.parts, null. '  '));
			ctx.resp.end;
		}
	);

	// Now, you can plug meryl into a http server
	require('http').createServer(meryl.cgi).listen(8000);

Although the project described as web framework, it's currently acts as a 
router. It will grow as a minimalistic web framework.

Please note that the project is very very young, so use in caution.

