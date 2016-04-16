

/****** A P P ******/

// require('./app.css');

window.d3 = require('../node_modules/d3/d3.js');
window.Trach = require('../src/lib');

var PieChart = require('../examples/pie');

;(function () {

	window.chart = new PieChart();

	chart.config({
		width: 960,
		height: 500,
		target: document.querySelector('.chart1'),
	});
	chart.render();

	console.debug('done');
}.call(this));
