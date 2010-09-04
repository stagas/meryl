var meryl = require('./../../index'),
  template = meryl.findx('microtemplate');

meryl.x('render', template());

meryl.h('GET /', function() {
  this.render('home', {people: ['bob', 'alice', 'jane', 'meryl']});
});

require('http').createServer(meryl.cgi()).listen(3000);