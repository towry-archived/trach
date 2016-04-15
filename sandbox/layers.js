
var exports = module.exports;
var createLayer = require('../src').createLayer;
var translate = require('../src').utils.translate;

exports.SvgLayer = createLayer('svg', {
	init: function () {

	},

	render: function () {
		var selection = this.get('selection');
		if (!selection) {
			selection = this.set('selection', document.body, true);
		}

		var svg = d3.select(selection).append('svg')
			.attr('class', this.get('class', 'svg'))
			.attr('width', this.get('width', 800))
			.attr('height', this.get('height', 400))
		.append('g')
			.attr('transform', translate(20, 20));
	}
})


exports.BarLayer = createLayer('bar', {
	init: function () {
		this._pie = d3.layout.pie()
			.sort(null);
	},

	render: function () {
		var selection = this.get('selection');

	}
})
