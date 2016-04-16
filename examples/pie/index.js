
// stylesheets
require('./pie.css');

// javascripts
var createLayer = require('../../src').createLayer;
var SvgLayer = require('../../src/layers/svg');
var PieLayer = require('./pie-layer');
var data = require('./data');


var PieChart = createLayer('PieChart', {

	init: function () {
		this._initLayers();
	},

	config: function (options) {
		this.set('width', options.width);
		this.set('height', options.height);
		this.set('target', options.target);
		this.set('data', data);
		this.set('margin', options.margin || {
			top: options.height / 2,
			left: options.width / 2,
			bottom: 20,
			right: 20
		})
	},

	_initLayers: function () {
		var svgLayer = new SvgLayer();
		var pieLayer = new PieLayer();
		svgLayer.append(pieLayer);

		this.append(svgLayer); 
	}
});

module.exports = PieChart;
