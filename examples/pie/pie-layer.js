
var createLayer = require('../../src').createLayer;
var translate = require('../../src/').utils.translate;

module.exports = createLayer('pieLayer', {

	init: function () {
		var context = this.context();
		var radius = Math.min(context.svg_width, context.svg_height) / 2;

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
			'svg_width': 'the svg width',
			'svg_height': 'the svg height'
		}
	},

	update: function () {
		var self = this;
		var data = this.context().data;
		var g = this.context().selection
			.selectAll('.arc')
			.data(this._pie(data))
		.enter().append('g')
			.attr('class', 'arc');
		g.append('path')
			.attr('d', this._arc)
			.style('fill', function (d) {
				return self._color(d.data.age);
			});
		g.append('text')
			.attr('transform', function (d) {
				return translate(self._labelArc.centroid(d));
			})
			.attr('dy', '.35em')
			.text(function (d) {
				return d.data.age;
			});
	}
})
