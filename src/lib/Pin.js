
/**
 * @module pin
 *
 * Pin is a tool to make object's property less mess.
 */

function Pin () {
	this._pins_ = {};
}

/**
 * Get a value by the key.
 * @param {string} key
 * @param {object} defVal - The default value.
 */
Pin.prototype.get = function (key, defVal) {
	if (key in this._pins_) {
		return this._pins_[key];
	} 
	// else if (defVal === undefined) {
	// 	throw new Error("_pin_['" + key + "'] is not set.");
	// }

	return defVal || null;
}

Pin.prototype.set = function (key, value, ret) {
	if (this._pins_['__PIN_FREEZE__ED']) {
		typeof console !== 'undefined' && console.warn("This pin has freezed");
		return;
	}

	if (value === undefined) {
		value = null;
	}
			
	this._pins_[key] = value;
	
	if (!ret) {
		return this;
	} else {
		return value;
	}
}

Pin.prototype.freeze = function () {
	this._pins_['__PIN_FREEZE__ED'] = true;
}


module.exports = Pin;
