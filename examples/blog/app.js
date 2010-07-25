var meryl = require('./../../lib/meryl');
	// We love mustache!
	mustache = require('mustache'),
	sys = require('sys'),
	fs = require('fs');

var posts = [
	{id: 0, title: 'post 1', body: 'what a body!'},
	{id: 1, title: 'post 2', body: 'more beautiful one'}
];

//  Our helper functions

var readFile = function (path) {
	return fs.readFileSync(__dirname + path.replace(/^\.*/, ''), 'utf-8');
}

var static = function(path) {
	return readFile('/public/' + path);
};

var render = function(viewname, data) {
	var viewCnt = readFile('/view/' + viewname + '.mu');
	return mustache.to_html(viewCnt, data);
};

// Middleware filters

meryl.p('GET .*', function() {
		this.headers.Server = 'Node - Meryl';
		return true;
	}
);

// Static file handler

meryl.h('GET /static/<filepath>', function () {
		return static(this.filepath);
	}
);

// Homepage handler

meryl.h('GET /', function () {
		return render('index', {posts: posts});
	}
);

// Sub page handler

meryl.h('GET /{postid}', function () {
		return render('subpage', {post: posts[this.postid]});
	}
);

require('http').createServer(meryl.cgi).listen(3000);
sys.debug('serving http://localhost:3000');