var meryl = require('../../index'),
  qs = require('querystring');
  staticfile = meryl.findp('staticfile'),
  microtemplate = meryl.findx('microtemplate');

var twinkles =  ['This is my freaking first wink', 'Hey tweeting sucks, lets twinkle'];

meryl
.x('render', microtemplate())
.x('redirect', function(loc) {
  this.status = 301;
  this.headers['Location'] = loc;
  this.send();
})
.x('decodeSimplePostData', function(postdata) {
  if(typeof postdata != 'string')
    return qs.parse(postdata.toString());
  return qs.parse(postdata);
})

.p('GET /static/<filepath>', staticfile());

.h('GET /', function() {
  this.render('index', {twinkles: twinkles});
})
.h('POST /newtweet', function() {
  var data = this.decodeSimplePostData(this.postdata);
  if(data.wink) {
    twinkles.push(data.wink);
   }
  this.redirect('/');
});

require('http').createServer(meryl.cgi()).listen(3000);
