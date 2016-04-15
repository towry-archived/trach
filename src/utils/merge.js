
/**
 * @module merge
 *
 * Merge several object into one object, preserve the resest object but
 * modify the first object.
 */

var is = require('./is');

/**
 * @param {...} 
 * example: 
 *	var isDeep = false; // deep copy?
 *	var newObj = extend({}, old, other, other2, isDeep);
 */
module.exports = function () {
	var args = [].slice.call(arguments);
	var i = 0;
	var target = args[i++] || {};
	// is deep copy
	var deep = false;
	var isArr = false;
	var copy, src, clone;

	if (typeof args[args.length - 1] === 'boolean') {
		deep = args[args.length - 1];
		args.pop();
	}
	var options = null;
	for (; i < args.length; i++) {
		options = args[i] || null;
		if (options === null) {
			continue;
		}

		for (var key in options) {
			copy = options[key];
			src = target[key];

			if (copy === target) {
				continue;
			}

			if (copy && deep && (is.isObject(copy) ||
				(isArr = is.isArray(copy))) ) {

				if (isArr) {
					isArr = false;
					clone = src && is.isArray(src) ? src : [];
				} else {
					clone = src && is.isObject(src) ? src : {};
				}

				target[key] = extend(clone, copy, true);
			} else if (copy !== undefined) {
				target[key] = copy;
			}
		}
	}

	return target;
}

