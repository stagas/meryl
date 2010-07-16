Meryl
=====
Minimalistic web framework for nodejs platform.

Usage
-----

Once you obtain the library, you should import meryl like shown below.

	var meryl = require('./lib/meryl');

Now you are ready to use small meryl! 

First of all, register some plugins (You sometimes refer it filters stay 
as middleware)

	meryl.p('/{whatever}', function() {
		this.headers.Server = 'Node Http Server';
		return true;
	});
	
	meryl.p('/secret/{secretfilepath}', function() {
		var oops = new Error("oops! you tried to access " + this.secretfilepath);
		oops.status = 401;
		throw oops;
	});

Every matched plugin applied to request in order they declared. If want you break
the chain you must return 'false' in plugin.

'this' keyword refers plugin context, there are plenty of things that you
should require, please read code for details.

As you can see, there some variable definitions in path to capture some requests.
There are two kinds of path variable.

* {...} declared variables are greedy, so they match everything they meet.
* <...> declared variables are partial, so they match everything till they meet
  '?', '/', or '.' character.

You can now register any handler you want. Note again that 'this' keyword refers
to handler context and contains some required information. Please read code 
again for details.
 
	meryl.h("GET /post/<postid>.html",
		function() {
			return "<p>You're reading the post #" + this.postid + "</p>";
		}
	);

Nice! Now you can attach meryl into a http server.

	require('http').createServer(meryl.cgi).listen(8000);
	
Of course run the code with node. You can find this code under 'examples'
directory.

	$~meryl/examples> node hello.js
	listening port 8080 at localhost
	
Now you can test it using curl tool like:

	curl -v http://localhost:8080/post/234.html
	
The result must be:

	* About to connect() to localhost port 8080 (#0)
	*   Trying ::1... Connection refused
	*   Trying fe80::1... Connection refused
	*   Trying 127.0.0.1... connected
	* Connected to localhost (127.0.0.1) port 8080 (#0)
	> GET /post/234.html HTTP/1.1
	> User-Agent: curl/7.21.0 (i386-apple-darwin9.8.0) libcurl/7.21.0 OpenSSL/1.0.0a zlib/1.2.5 libidn/1.19
	> Host: localhost:8080
	> Accept: */*
	> 
	< HTTP/1.1 200 OK
	< Content-Type: text/html
	< Server: Node Http Server
	< Connection: keep-alive
	< Transfer-Encoding: chunked
	< 
	* Connection #0 to host localhost left intact
	* Closing connection #0
	<p>You're reading the post #234</p>

That's it. Note that the 'Server' header that is assigned as 'Node Http Server'.
It acknowledges that our plugin worked!

As in by browser.

![meryl](http://kadirpekel.com/meryl.png)


Now you can try below and see what happens.

	curl -v http://localhost:8080/secret/topsecret/nothingspecial.html
	

Sum Up
======

I know this documentation sucks, but will be fine in the future.

Although the project described as web framework, it currently acts as a 
router. It will grow as a minimalist web framework.

Please note that the project is very very young and no serious tests done. Also it's
dirty but if i find some more time to deal, i'll try to fix all.

So use this code with caution.

Licensing? Here <http://www.apache.org/licenses/LICENSE-2.0.txt>

Cheers!

Twitter: <http://twitter.com/kadirpekel>

Copyright [2010] [Kadir PEKEL]
