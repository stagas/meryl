var meryl = require('../../index');
  
meryl.h('GET /', function () {
  this.send("<h1>Hello World!</h1>");
});

require('http').createServer(meryl.cgi()).listen(3000);
console.log('serving http://localhost:3000');