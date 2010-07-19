require.paths.unshift('../lib');

var sys = require('sys'),
	http = require('http'),
	meryl = require('meryl');

// Raw regex example plugin, it runs on every request

meryl.p('.*', function() {
	this.headers.Server = 'Node Http Server';
	return true;
});

// More complex plugin example with parameters
// Restrict access to all pdf files under secret path

meryl.p('{method} /secret/{infinitepath}.pdf', function() {
	var oops = new Error("Denied: " + this.infinitepath + " for method: " + this.method);
	oops.status = 401;
	throw oops;
});

// Simple handler

meryl.h('GET /', function() {
	return "<h1>Home page</h1>";
});

// Handler example with partial path parameter

meryl.h('GET /post/<postid>.html', function() {
	return "<h1>You are reading post:" + this.postid  + "</h1>";
});

// Handler example with multiple path parameters

meryl.h('GET /post/<postid>/comment/<commentid>.html', function() {
	return "<h1>You are reading comment:" + this.commentid 
		+ " of post:" + this.postid + "</h1>";
});

// Handler using post method with post data

meryl.h('POST /post/new', function() {
	return "<h1>You posted</h1><pre>" + this.data + "</pre>";
});

http.createServer(meryl.cgi).listen(8080);
sys.puts('listening port 8080 at localhost');
