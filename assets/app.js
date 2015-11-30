

/****** A P P ******/

var __d = (function () {
	var p = [];
	for (var i = 0; i < 30; i++) {
		p.push(Math.floor(Math.random() * 30 + 1));
	}
	return p;
})();

var _data_ = {
	main: __d
};
var ele = document.querySelector('.chart1');

var config = function (trach) {
	var lineLayer = trach.getLayer('data-line');
	lineLayer.set('class', 'line line1');

	var tooltip = Trach.plugin('tooltip').factory({
		dir: 'right',
		taken: document.body
	});

	trach.config('event-area', ['dot-bars', 'ruler'], function (bar, ruler) {
		this.set('mouseover', function () {
			ruler.dnode().classed('hide', false);
		});
		this.set('mouseout', function () {
			setTimeout(function () {
				if (bar.get('enterDotbar')) {
					return;
				}
				ruler.dnode().classed('hide', true);
			}, 0);
		});
		this.set('mousemove', function () {
			var coord = d3.mouse(this);
			ruler.dnode().attr('transform', 'translate(' + coord[0] + ',' + '0)');
		});
	});

	trach.config('dot-bars', ['ruler', 'clippath', 'dots'], function (ruler, clippath, dots) {
		var self = this;
		var root = self.root().dnode();

		this.set('mouseover', function () {
			self.set('enterDotbar', true);
			if (ruler.dnode().classed('hide')) {
				ruler.dnode().classed('hide', false);
			}

			var dnode = d3.select(this);
			var id = +(dnode.attr('data-id'));

			var dot = root.select('.' + dots.get('dot-class') + '-' + id)
				.classed('hover', true);

			var rect = d3.select('#' + clippath.id())
				.select('rect').node().getBoundingClientRect();

			var x = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
			var y = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;

			tooltip.show().position({
				left: +(dot.attr('cx')) + rect.left + x,
				top: +(dot.attr('cy')) + rect.top + y
			}).text((dot.data())[0]);
		});

		this.set('mousemove', function () {
			var coord = d3.mouse(this);
			ruler.dnode().attr('transform', 'translate(' + coord[0] + ',' + '0)');
		});

		this.set('mouseout', function () {
			self.set('enterDotbar', false);
			ruler.dnode().classed('hide', true);
			var dnode = d3.select(this);
			var id = +(dnode.attr('data-id'));

			root.select('.' + dots.get('dot-class') + '-' + id)
				.classed('hover', false);

			tooltip.hide();
		});
	});
}

var app = new Trach('myChart', _data_, ele, {
	grid: true,
	config: config
});
app.render();

var app2 = new Trach('myChart2', _data_, document.querySelector('.chart2'), {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();

var app2 = new Trach('myChart2', _data_, null, {
	grid: true,
	config: config
});
app2.render();
