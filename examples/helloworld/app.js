var meryl = require('./../../lib/meryl');
	staticfile = require('./../../lib/plugins/staticfile');

meryl.p('GET /static/<filepath>', staticfile());

meryl.p('GET <whatever>', function(req, resp, chain) {
	this.headers['Server'] = 'node';
	chain();
});

meryl.p('POST .*', function() {
	this.status = 405;
	throw new Error('method not allowed');
});

meryl.p('{method} /private/.*', function() {
	this.status = 404;
	throw new Error('access denied');
});

meryl.h('GET /', function (req, resp) {
	this.status = 301;
	this.headers['Location'] = '/static/index.html';
	this.send();
});

meryl.h('GET /exception', function (req, resp) {
	this.send(1);
});

require('http').createServer(meryl.cgi({prod:false})).listen(3000);
require('sys').debug('serving http://localhost:3000');