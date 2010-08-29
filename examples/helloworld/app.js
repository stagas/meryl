var meryl = require('./../../index');
	staticfile = meryl.findp('staticfile');

meryl.p('GET /static/<filepath>', staticfile());

meryl.p('{method} <path>', function(req, resp, chain) {
	this.headers['Server'] = 'node';
	console.log(this.params.method + ' ' + this.params.path);
	chain();
});

meryl.p('POST .*', function() {
	this.status = 405;
	throw new Error('method not allowed');
});

meryl.p('{method} /private/.*', function() {
	this.status = 401;
	throw new Error('access denied');
});

meryl.h('GET /', function (req, resp) {
	this.status = 301;
	this.headers['Location'] = '/static/index.html';
	this.send();
});

meryl.h('GET /posts/{postuid}', function (req, resp) {
	this.send("<h1>You're reading post: "+ this.params.postuid +"</h1>");
});

meryl.h('GET /exception', function (req, resp) {
	this.send(1);
});

require('http').createServer(meryl.cgi({prod:false})).listen(3000);
console.log('serving http://localhost:3000');
