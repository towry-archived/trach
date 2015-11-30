
(function (Tooltip) {
	return;
	
	var margin = {top: 20, right: 20, bottom: 20, left: 40};
	var width = 960 - margin.left - margin.right;
	var height = 500 - margin.top - margin.bottom;

	var padding = 20;
	var enterDotbar = false;

	// scale
	var xscale = d3.scale.linear().range([padding, width - padding]);
	var yscale = d3.scale.linear().range([height - padding, padding]);

	// domain
	yscale.domain(d3.extent(datac));
	xscale.domain(d3.extent(datac, function (d, i) {
		return i;
	}));

	// xaxis
	var xaxis = d3.svg.axis().scale(xscale).orient('bottom');
	var yaxis = d3.svg.axis().scale(yscale).orient('left');

	// create svg element
	var svg = d3.select('.chart1').append('svg')
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
	.append('g')
		.attr('transform', "translate(" + margin.left + "," + margin.top + ")");

	// create x-axis
	svg.append('g')
		.attr('class', 'x axis')
		.attr('transform', 'translate(0, ' + height + ')')
		.call(xaxis.tickFormat(d3.format('d')))

	// create y-axis
	svg.append('g')
		.attr('class', 'y axis')
		.call(yaxis);

	// create grid 
	svg.append('g')
		.attr('class', 'x grid')
		.attr('transform', 'translate(0, ' + height + ')')
		.style('stroke-dasharray', ('3, 3'))
		.call(xaxis.tickSize(-height, 0, 0).tickFormat(''));

	svg.append('g')
		.attr('class', 'y grid')
		.style('stroke-dasharray', ('3, 3'))
		.call(yaxis.tickSize(-width, 0, 0).tickFormat(''));

	// style specific grid
	d3.selectAll('.grid .tick')
		.filter(function (d) {
			return d3.format('d')(d) != '';
		})
		.select('line')
		.attr('class', 'em');

	// create clippath before draw the line
	svg.append('clipPath')
		.attr('id', 'clip')
		.append('rect')
		.attr('width', width)
		.attr('height', height);

	// draw the ruler

	var ruler = svg.append('line')
			.attr('class', 'x ruler hide')
			.attr('y1', height)
			.attr('y2', 0)
			/* our expectation is 2px, but the line is bound
			 * with clip path, so it should be 4px
			 */
			.style('stroke-width', 4)   
			.attr('clip-path', 'url(#clip)');

	// draw the line
	var line1 = d3.svg.line()
		.interpolate('linear')
		.x(function (d, i) { return xscale(i); })
		.y(function (d) { return yscale(d); });

	svg.append('path')
		.datum(datac)
		.attr('class', 'line line1')
		.attr('clip-path', 'url(#clip)')
		.attr('fill', 'none')
		.attr('d', line1);

	// draw the dots
	svg.append('g')
		.datum(datac)
		.attr('class', 'dots')
		.attr('clip-path', 'url(#clip)')
	.selectAll('.dot')
		.data(datac)
	.enter().append('circle')
		.attr('class', function (d, i) {
			return 'dot dot-' + i;
		})
		.attr('r', 6)
		.attr('cx', function (d, i) {
			return xscale(i);
		})
		.attr('cy', function (d) {
			return yscale(d);
		});

	var tooltipForThisChart = new Tooltip({
		dir: 'right',
		taken: document.body
	});

    // create the event area
	var eventarea = svg.append('g')
		.attr('class', 'eventarea')
		.style('pointer-events', 'all');
		
		// expand the area
		eventarea.append('rect')
			.attr('width', width)
			.attr('height', height)
			.style('visibility', 'hidden');

	eventarea
		.on('mouseover', function () {
			ruler.classed('hide', false);
		})
		.on('mouseout', function () {
			setTimeout(function () {
				if (enterDotbar) {
					return;
				}
				ruler.classed('hide', true);
			}, 0);
		})
		.on('mousemove', function () {
			var coord = d3.mouse(this);
			// var x0 = xscale.invert(coord[0]);
			// var y0 = yscale.invert(coord[1]);

			// var i = bisector(datac, y0);
			// move the ruler
			ruler.attr('transform', 'translate(' + coord[0] + ',' + '0)');
		});

	// draw the dotbars
	svg.append('g')
		.datum(datac)
		.attr('class', 'dot-bars')
		.attr('clip-path', 'url(#clip)')
	.selectAll('.dot-bar')
		.data(datac)
	.enter().append('rect')
		.attr('class', 'dot-bar')
		.attr('data-id', function (d, i) {
			return i;
		})
		.attr('x', function (d, i) {
			return xscale(i) - 6;
		})
		.attr('y', 0)
		.attr('width', 12)  // the dot width
		.attr('height', height)
		.style('fill', 'transparent')
	.on('mouseover', function () {
		enterDotbar = true;
		if (ruler.classed('hide')) {
			ruler.classed('hide', false);
		}

		var self = d3.select(this);
		var id = +(self.attr('data-id'));

		var dot = d3.select('.dot-' + id)
			.classed('hover', true);

		var rect = svg.select('#clip')
			.select('rect').node().getBoundingClientRect();

		tooltipForThisChart.show().position({
			left: +(dot.attr('cx')) + rect.left, 
			top: +(dot.attr('cy')) + rect.top
		}).text((dot.data())[0]);

	})
	.on('mouseout', function () {
		enterDotbar = false;

		ruler.classed('hide', true);
		var self = d3.select(this);
		var id = +(self.attr('data-id'));

		d3.select('.dot-' + id)
			.classed('hover', false);

		tooltipForThisChart.hide();
	})
	.on('mousemove',function () {
		var coord = d3.mouse(this);
		ruler.attr('transform', 'translate(' + coord[0] + ',' + '0)');
	});

}(function () {

	var _id = 0;

	// tooltip for d3
	function Tooltip (config) {
		config = config || {};

		this.config = {
			dir: 'right',
			classed: 'tooltip-for-d3',
			taken: null
		}
		this.config = Object.assign({}, this.config, config);

		this.takened = null;
		this.element = null;
		this.id = _id++;

		if (this.config.taken) {
			this.taken(this.config.taken);
		}
	}

	Tooltip.prototype.position = function (variant) {
		variant = variant || {};
		variant.left = variant.left || 0;
		variant.top = variant.top || 0;

		// get dot offset
		var rect = this.element.node().getBoundingClientRect();

		var padding = 10; 

		variant.left = variant.left + 7 + padding + 'px';
		variant.top = variant.top - rect.height / 2 - 6 + 'px';

		this.element.style(variant);

		return this;
	}

	Tooltip.prototype.show = function () {
		if (!this.element) return;
		if (this.element.attr('data-id') !== '' + this.id) {
			this.hide();
			this.element = null;
			this.taken(this.takened);
		}
		this.takened.appendChild(this.element.node());
		this.element.classed('invisible', false);

		return this;
	}

	Tooltip.prototype.hide = function () {
		if (!this.element) return;
		this.element.classed('invisible', true);
		this.element.remove();
	}

	/**
	 * @param {object} ele - The parent element of tooltip
	 */
	Tooltip.prototype.taken = function (ele) {
		if (!ele) {
			throw new TypeError("Tooltip.taken method require an argument");
		}

		if (this.takened === ele && this.element) {
			return this;
		} else {
			this.takened = ele;
		}

		
		var owner = d3.select(ele)
			.append('div')
				.attr('class', 'invisible')
				.classed(this.config.classed, true);
		owner.append('div')
			.classed(this.config.classed + '--content', true)
			.attr('data-owner', this.id);

		// reset
		this.element = owner;
		this.hide();

		return this;
	}

	/**
	 * This should last call
	 */
	Tooltip.prototype.text = function (content) {
		return this.element && this.element.select('.' + this.config.classed + '--content')
			.text(content);
	}

	/**
	 * This should be last call
	 */
	Tooltip.prototype.html = function (content) {
		return this.element && this.element.select('.' + this.config.classed + '--content')
			.html(content);
	}

	return Tooltip;
}()));
