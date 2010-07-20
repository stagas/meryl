Meryl
=====

Minimalistic web framework for nodejs platform.

Install
-------

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

	meryl.p('.*', function (req, resp) {
		this.headers.Server = 'Node Server';
		this.send("Header modified!");
		return true;
	});

	meryl.h('GET /post/{postid}/comment/{commentid}.html', function (req, resp) {
		this.send("<h1>You are reading post #" + this.postid + "</h1>");
	});

	http.createServer(meryl.cgi).listen(3000);
	sys.puts('listening port 3000 at localhost');
	

Sum Up
------

Although the project described as web framework, it currently acts as a 
router. It will grow as a minimalist web framework.

Please note that the project is very very young and no serious tests done.

So use this code with caution.

Twitter: <http://twitter.com/kadirpekel>

