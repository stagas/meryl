var meryl = require('./../../index');

meryl.p('{method} <path>', function (chain) {
  this.headers['Server'] = 'node';
  console.log(this.params.method + ' ' + this.params.path);
  chain();
});

meryl.p('POST *', function () {
  this.status = 405;
  throw new Error('method not allowed');
});

meryl.p('{method} /private/*', function () {
  this.status = 401;
  throw new Error('access denied');
});

meryl.h('GET /', function () {
  this.send("<h1>Demonstraing Meryl</h1>");
});

meryl.h('GET /{pagename}\.html', function () {
  this.send("<h1>You're reading: " + this.params.pagename + "</h1>");
});

meryl.h('GET /exception', function () {
  this.send(1);
});

require('http').createServer(meryl.cgi({
  prod: false
})).listen(3000);

console.log('serving http://localhost:3000');