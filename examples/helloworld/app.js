var meryl = require('../../index');
  
require('http').createServer(
  meryl.h('GET /', function () {
    this.send("<h1>Hello World!</h1>");
  }).cgi()
).listen(3000);
console.log('serving http://localhost:3000');