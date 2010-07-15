Meryl
=====
Minimalistic web framework for nodejs platform.

Install
=======

Use npm for painless, quicky experience.

	> npm install meryl

Yep, it's ready already.

Usage
-----

Once you obtain the library, you should import meryl like shown below.

	var meryl = require('meryl');

Now you are ready to use small meryl!

Currently you can refer to simple example 'hello.js' under 'examples' directory

  require.paths.unshift('../lib');

  var sys = require('sys'),
  	http = require('http'),
  	meryl = require('meryl');

  meryl.h('GET /post/{postid}/comment/{commentid}.html', function(req, resp) {
    resp.writeHead(200, {'Content-Type': 'text/html'});
  	resp.write("<h1>You are reading post #" + req.params.postid + "</h1>");
  	resp.write("<h2>You are reading comment #" + req.params.commentid + "</h2>");
  	resp.end();
  });

  http.createServer(meryl.cgi).listen(8080);
  sys.puts('listening port 8080 at localhost');

Sum Up
======

I know this documentation sucks, but will be fine in the future.

Although the project described as web framework, it currently acts as a 
router. It will grow as a minimalist web framework.

Please note that the project is very very young and no serious tests done. Also it's
dirty but if i find some more time to deal, i'll try to fix all.

So use this code with caution.

Twitter: <http://twitter.com/kadirpekel>
