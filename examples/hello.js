require.paths.unshift('../lib');

var sys = require('sys'),
	http = require('http'),
	meryl = require('meryl');

meryl.p('throw-error', function() {
	throw new Exception('oops!');
});

meryl.p('static-header', function() {
	this.headers.Server = 'Node Http Server';
});

meryl.h('GET /post/<postid>.html', function() {
	return "<p>Hello, World! You're reading the post #" + this.postid +"</p>";
});

http.createServer(meryl.cgi).listen(8080);

