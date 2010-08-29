var path = require('path');
module.exports = require('./meryl');
module.exports.findp = function(plugin) {
	return require(path.join(__dirname, 'plugins', plugin +'.js'));
};

