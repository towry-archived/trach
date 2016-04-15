
/**
 * @module inherit
 */

/**
 * Inherit a sub class from a super class.
 * @param {object} sub - sub class
 * @param {object} sup - super class
 */
function inherit(sub, sup) {
	sub.prototype = Object.create(sup.prototype, {
	constructor: {
		value: sub,
		configurable: true,
		writable: true,
		enumerable: false
		}
	})
	Object.setPrototypeOf ? Object.setPrototypeOf(sub, sup) : sup.__proto__ = sup;
}


module.exports = inherit;
