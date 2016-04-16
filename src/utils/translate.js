
var is = require('./is');

module.exports = function (x, y) {
	if (is.isArray(x)) {
		y = x.length == 2 ? x[1] : x[0];
		x = x[0];
	}
	
	return 'translate(' + x + ', ' + y + ')';
}
