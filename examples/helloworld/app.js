var meryl = require('./../../lib/meryl');

meryl.p('GET <whatever>', function() {
	this.headers['Server'] = 'node';
	return true;
});

meryl.h('GET /', function (req, resp) {
	return "<h1>Hello, World</h1>";
});

require('http').createServer(meryl.cgi).listen(3000);
require('sys').debug('serving http://localhost:3000');
