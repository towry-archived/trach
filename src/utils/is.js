
/**
 * @module is
 *
 * Provide some function to detect the object type.
 */

var toS = Object.prototype.toString;
var exports = module.exports;

exports.isObject = function (o) {
	return toS.call(o) === '[object Object]';
}

exports.isFunction = function (o) {
	return typeof o === 'function';
}

exports.isArray = function (o) {
	return toS.call(o) === '[object Array]';
}

exports.isString = function (o) {
	return toS.call(o) === '[object String]';
}
