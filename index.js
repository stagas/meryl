var path = require('path');
module.exports = require('./lib/meryl');
module.exports.findp = function(plugin) {
	return require(path.join(__dirname, 'lib', 'plugins', plugin +'.js'));
};

