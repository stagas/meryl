var meryl = require('./../lib/meryl');

meryl.p('.*', function (req, resp) {
	this.headers.Server = 'Node Server';
	return true;
});

meryl.p('GET /post/.*', function (req, resp) {
	require('sys').debug('logging for post: ' + this.pathname);
	return true;
});

meryl.p('GET /post/911.html', function (req, resp) {
	throw new Error('access denied');
});

meryl.h('GET /post/{postid}.html', function (req, resp) {
	return "<h1>You are reading post #" + this.postid + "</h1>";
});

require('http').createServer(meryl.cgi).listen(3000);