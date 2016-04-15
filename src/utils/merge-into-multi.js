
/**
 * @module mergeIntoMulti
 *
 * Merge the object by key, if key exists, make the value an array.
 */

var is = require('./is');
var hasOwn = Object.prototype.hasOwnProperty;

module.exports = function (original, external) {
	var tmp = null;
	for (var name in external) {
		if (!hasOwn.call(external, name)) {
			continue;
		}

		if (!is.isString(external[name])) {
			throw new Error("context must returns an object with string values.");
		}

		if (name in original) {
			tmp = original[name];
			if (is.isArray(tmp)) {
				tmp.push(external[name]);
				continue;
			}

			// else 
			original[name] = [tmp, external[name]];
		} else {
			original[name] = [external[name]];
		}
	}
}
