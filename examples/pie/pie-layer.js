
var createLayer = require('../../src').createLayer;

module.exports = createLayer('pieLayer', {

	init: function () {
		var context = this.context();
		var radius = Math.min(context.width, context.height) / 2;

		this._color = d3.scale.ordinal()
			.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
		this._arc = d3.svg.arc()
			.outerRadius(radius - 10)
			.innerRadius(0);
		this._labelArc = d3.svg.arc()
			.outerRadius(radius - 40)
			.innerRadius(radius - 40);
		this._pie = d3.layout.pie()
			.sort(null)
			.value(function (d) {return d.population; });
	},

	context: function () {
		return {
			'width': 'the svg width',
			'height': 'the svg height'
		}
	},

	update: function () {
		console.debug('yeah, I am called');
	},

	render: function () {
		console.debug("I am called");
	}
})
