var meryl = require('./../../lib/meryl');

meryl.p('GET <whatever>', function(req, resp, chain) {
	this.headers['Server'] = 'node';
	chain();
});

meryl.h('GET /', function (req, resp) {
	this.send("<h1>Hello, World</h1>");
});

require('http').createServer(meryl.cgi()).listen(3000);
require('sys').debug('serving http://localhost:3000');
