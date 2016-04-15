
var Trach = require('../../src');
var SvgLayer = require('../../src/layers/svg');
var PieLayer = require('./pie-layer');
var data = require('./data');

module.exports = function(options) {
	var svgLayer = new SvgLayer({});
	var pieLayer = new PieLayer({});

	svgLayer.append(pieLayer);
	svgLayer.set('width', 680);
	svgLayer.set('height', 390);
	svgLayer.set('target', document.body);
	svgLayer.set('data', data);

	svgLayer.render();
	pieLayer.render();
	window.svgLayer = svgLayer;
}
