var path = require('path');
module.exports = require('./meryl');

var find = function (dir, name) {
  return require(path.join(__dirname, dir, name + '.js'));
};
module.exports.findp = function (plugin) {
  return find('plugins', plugin);
};
module.exports.findx = function (extension) {
  return find('extensions', extension);
};
