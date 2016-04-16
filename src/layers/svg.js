
var createLayer = require('../lib').createLayer;
var translate = require('../utils').translate;

module.exports = createLayer('svg', {

	init: function () {
		var context = this.context();
		var margin = this.get('margin');
	},

	context: function () {
		/**
		 * Like react's propTypes?
		 */
		return {
			width: 'the svg width',
			height: 'the svg height',
			target: 'the svg container',
			margin: 'the svg margins'
		}
	},

	contextReceiveChange: function (ctx) {
		this.set('svg_width', ctx.width);
		this.set('svg_height', ctx.height);
		this.set('width', ctx.width - ctx.margin.left - ctx.margin.right);
		this.set('height', ctx.height - ctx.margin.top - ctx.margin.bottom);
		this.set('data', ctx.data);
		this.set('margin', ctx.margin);
	},

	render: function () {
		var selection = this.context().target;
		if (!selection) {
			return;
		}
		var margin = this.get('margin');

		var svg = d3.select(selection).append('svg')
			.attr('class', this.get('class', 'svg'))
			.attr('width', this.get('svg_width'))
			.attr('height', this.get('svg_height'))
		.append('g')
			.attr('transform', translate(margin.left, margin.top));

		return svg;
	}
})
