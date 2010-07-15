require.paths.unshift('../lib');

var sys = require('sys'),
	http = require('http'),
	meryl = require('meryl');


meryl.h('{method} /post/{postid}/comment/{commentid}.html', function(req, resp, next) {
  resp.writeHead(200, {'Content-Type': 'text/html'});
	resp.write("<h1>"+ req.params.method + " post for " + req.params.postid + "</h1>");
	resp.write("comment " + req.params.commentid);
	resp.write("data " + req.data);
	resp.end();
});

http.createServer(meryl.cgi).listen(8080);
sys.puts('listening port 8080 at localhost');
