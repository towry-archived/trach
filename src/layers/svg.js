
var createLayer = require('../lib').createLayer;
var translate = require('../utils').translate;

module.exports = createLayer('svg', {

	init: function () {
	
	},

	update: function () {
		var selection = this.get('selection');
		var group = selection.selectAll('.arc')
			.data(this.get('pie')(data))
		.enter().append('g')
			.attr('class', 'arc');

		group.append('path')
			.attr('d', arc)
			.style('fill', function (d) {
				return color(d.age); // todo
			});

		group.append('text')
			.attr('transform', function (d) {return translate(0, 0)}) // todo
			.attr('dy', '.35em')
			.text(function (d) { return d.data }) // todo 
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
