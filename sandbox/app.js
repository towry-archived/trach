

/****** A P P ******/

require('./app.css');

window.d3 = require('../node_modules/d3/d3.js');
window.Trach = require('../src/lib');

window.createPie = require('../examples/pie');

createPie();

;(function () {
	console.debug('done');
}.call(this));
