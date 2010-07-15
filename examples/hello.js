require.paths.unshift('../lib');

var sys = require('sys'),
	http = require('http'),
	meryl = require('meryl');

meryl.p('/{whatever}', function() {
	this.headers.Server = 'Node Http Server';
	return true;
});

meryl.p('/secret/{secretfilepath}', function() {
	var oops = new Error("oops! you tried to access " + this.secretfilepath);
	oops.status = 401;
	throw oops;
});

meryl.h('GET /post/<postid>.html', function() {
	return "<p>Hello, World! You're reading the post #" + this.postid +"</p>";
});

http.createServer(meryl.cgi).listen(8080);
sys.puts('listening port 8080 at localhost');
