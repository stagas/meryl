/*!
 * Meryl
 * Copyright(c) 2010 Kadir Pekel.
 * MIT Licensed
 */

/*
 * Modules dependencies
 */
var path = require('path');
module.exports = require('./meryl');

/*
 * Generic function tries to find a module
 * with given module name under given directory name
 *
 * @param {String} dir
 * @param {String} name
 * @return {Object}
 * @api private
 */
var find = function (dir, name) {
  return require(path.join(__dirname, dir, name + '.js'));
};

/*
 * Finds a plugin with given name
 *
 * @param {String} plugin
 * @return {Object}
 * @api public
 */
module.exports.findp = function (plugin) {
  return find('plugins', plugin);
};

/*
 * Finds an extension with given name
 *
 * @param {String} extension
 * @return {Object}
 * @api public
 */
module.exports.findx = function (extension) {
  return find('extensions', extension);
};

