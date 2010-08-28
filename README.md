Meryl
=====

Meryl is minimalistic web framework for nodejs platform.
It is really simple to use, fun to play and easy to modify.

Install
-------

Use npm for painless, quicky experience.

	> npm install meryl

Yep, it's ready already.

Quick start
-----------

Let's start with a hello world example, create a file 'app.js' with the given code below

	// import meryl
	var meryl = require('meryl');
	
	// Now define a request handler tied to an url expression.
	meryl.h('GET /', function () { this.send('<h3>Hello, World!</h3>'); });
	
	// OK, here we go. Let's plug meryl into your http server instance.
	require('http').createServer(meryl.cgi()).listen(3000);

You should run the code by node.

	> node app.js

Check it out from 'http://localhost:3000/'.
You should see the expected output.

### Hello, World! ###

Congrats! You did it.

More
----

Meryl has more! You can use advanced router pattern expressions. Also you can use
middleware logic structure to meryl's easy to use middleware implementation. Please 
refer to 'examples' directory under the tree for more sample usage scenarios

License
-------

MIT License

Sum Up
------

Please note that the project is very very young and no serious tests done.

So use this code with caution.

Twitter: <http://twitter.com/kadirpekel>

