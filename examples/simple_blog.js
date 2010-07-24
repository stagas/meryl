var meryl = require('./../lib/meryl');
	// We love mustache!
	mustache = require('mustache'),
	sys = require('sys');

var render = function() {
	return mustache.to_html.apply(this, arguments);
};

var posts = [
	{id: 0, title: 'post 1', body: 'what a body!'},
	{id: 1, title: 'post 2', body: 'what a body too'}
];

meryl.p('GET .*', function() {
		sys.debug('Path requested: ' + this.pathname);
		return true;
	}
);

meryl.h('GET /', function () {
		return render(
			'{{#posts}}<a href="{{id}}">{{title}}</a> {{/posts}}',
			{posts: posts});
	}
);

meryl.h('GET /{postid}', function () {
	sys.inspect(posts[this.postid]);
		return render(
			'{{#post}}<p>{{title}} - {{body}}</p>{{/post}}',
			{post: posts[this.postid]});
	}
);

require('http').createServer(meryl.cgi).listen(3000);
