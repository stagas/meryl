Meryl
=====

Meryl is minimalistic web framework for nodejs platform.
It is really simple to use, fun to play and easy to modify.

Install
-------

Use npm for painless, quicky experience.

	> npm install meryl

Yep, it's ready already.

Quickstart
----------

Let's start with a hello world example, create a file 'app.js' with the given code below

	// import meryl
	var meryl = require('meryl');
	
	// Now define a request handler tied to an url expression.
	meryl.h('GET /', function () { this.send('<h3>Hello, World!</h3>') });
	
	// OK, here we go. Let's plug meryl into your http server instance.
	require('http').createServer(meryl.cgi).listen(3000);

You should run the code by node.

	> node app.js

	
Check it out from 'http://localhost:3000/'.
You should see the expected output.

### Hello, World! ###

Congrats! You did it.

More
----

Meryl has more! You can use advanced router pattern expressions. Also you can use
middleware logic structure to meryl's easy to use middleware implementation. Here you
can see more advanced example which you can find under 'examples' directory.

	var meryl = require('meryl');
	
	meryl.p('.*', function (req, resp) {
		this.headers.Server = 'Node Server';
		return true;
	});
	
	meryl.p('GET /post/.*', function (req, resp) {
		require('sys').debug('logging for post: ' + this.pathname);
		return true;
	});
	
	meryl.p('GET /post/911.html', function (req, resp) {
		throw new Error('access denied');
	});
	
	meryl.h('GET /post/{postid}.html', function (req, resp) {
		this.send("<h1>You are reading post #" + this.postid + "</h1>");
	});
	
	require('http').createServer(meryl.cgi).listen(3000);

Sum Up
------

Although the project described as web framework, it currently acts more likely a
router library. But it will grow as a minimalist web framework.

Please note that the project is very very young and no serious tests done.

So use this code with caution.

Twitter: <http://twitter.com/kadirpekel>

