require.paths.unshift('../lib');

var sys = require('sys'),
	http = require('http'),
	meryl = require('meryl');

meryl.h('GET /post/{postid}/comment/{commentid}.html', function (req, resp) {
	resp.writeHead(200, {
		'Content-Type': 'text/html'
	});
	resp.write("<h1>You are reading post #" + req.params.postid + "</h1>");
	resp.write("<h2>You are reading comment #" + req.params.commentid + "</h2>");
	resp.end();
});

http.createServer(meryl.cgi).listen(8080);
sys.puts('listening port 8080 at localhost');
