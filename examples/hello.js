require.paths.unshift('../lib');

var sys = require('sys'),
	http = require('http'),
	meryl = require('meryl');

meryl.h('.*', function (req, resp) {
	this.headers.Server = 'Node Server';
	this.send("Header modified!");
	return true;
});

meryl.h('GET /post/{postid}/comment/{commentid}.html', function (req, resp) {
	this.send("<h1>You are reading post #" + this.postid + "</h1>");
});

http.createServer(meryl.cgi).listen(3000);
sys.puts('listening port 8080 at localhost');
