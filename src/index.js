/*! 
 * A simple d3 based chart library.
 * 
 * Copyright 2015 - 2016, Towry Wang
 * MIT Licensed https://github.com/towry/LICENSE/wiki/MIT-License
 */

(function (factory) {
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = factory();
	} else {
		window.Trach = factory();
	}
}(function () {
	var __DATA__ = {
		"xScale": "linear",
		"yScale": "linear",
		"main": []
	};
	
	var __OPTIONS__ = {
		x_accessor: function (d, i) { return i; },
		y_accessor: function (d, i) { return d; },
		x_format: d3.format('d'),
		width: 800,
		height: 400
	};
	
	// var layers = [
	// 	'axis',
	// 	'grid',
	// 	'clip',
	// 	'ruler',
	// 	'datapath',
		
	// 	'dots',
	// 	'eventarea',
	// 	'dotbars'
	// ];
	
	/* ========== F U N C T I O N =========== */
	
	function inherit (sub, sup) {
		sub.prototype = Object.create(sup.prototype, {
		constructor: {
			value: sub,
			configurable: true,
			writable: true,
			enumerable: false
			}
		})
		Object.setPrototypeOf ? Object.setPrototypeOf(sub, sup) : sup.__proto__ = sup;
	}
	
	function translate (a, b) {
		return 'translate(' + a + ',' + b + ')';
	}

	function className (name) {
		return '.' + name;
	}
	
	/* =========== C L A S S ============== */
	
	function Pin () {
		this._pins_ = {};
	}
	
	Pin.prototype.get = function (key) {
		if (key in this._pins_) {
			return this._pins_[key];
		} else {
			return null;
		}
	}
	
	Pin.prototype.set = function (key, value, ret) {
		if (this._pins_['__PIN_FREEZE__ED']) {
			typeof console !== 'undefined' && console.warn("This pin has freezed");
			return;
		}

		if (value === undefined) {
			value = null;
		}
				
		this._pins_[key] = value;
		
		if (!ret) {
			return this;
		} else {
			return value;
		}
	}

	Pin.prototype.freeze = function () {
		this._pins_['__PIN_FREEZE__ED'] = true;
	}
		
	/* =========== C L A S S ============== */
	
	function Layer (name, master) {
		if (!(master instanceof Trach)) {
			throw new TypeError("Layer master must be a Trach instance");
		}
		Pin.call(this);
		
		this.name = name || 'unknow(layer)';
		this._master = master;
		this.init();
	}
	inherit(Layer, Pin);
	
	Layer.prototype.render = function () {
		throw new Error("Not implemented");
	}
	
	Layer.prototype.init = function () {
		throw new Error("Missing method init");
	}
	
	Layer.prototype.dnode = function () {
		return this.get('dnode');
	}

	Layer.prototype.getLayer = function (layerName) {
		if (!this._master) {
			throw new Error("This layer does not have a controller");
		}

		return this._master.getLayer(layerName);
	}

	Layer.prototype.root = function () {
		return this.getLayer(this._master.getRootIndex());
	}

	var createLayer = (function () {
		var hasOwn = Object.prototype.hasOwnProperty;

		function createLayer (name, defs) {

			function SubLayer () {
				var args = Array.prototype.slice.call(arguments);
				if (!args.length) {
					throw new TypeError("Missing controller for this layer");
				}

				args.unshift(name);
				Layer.apply(this, args);
			}
			inherit(SubLayer, Layer);

			if (Object.prototype.toString.call(defs) !== '[object Object]') {
				throw new TypeError("Invalid argument, object is require");
			}
			
			var prop = SubLayer.prototype;

			for (var m in defs) {
				if (hasOwn.call(defs, m)) {
					prop[m] = defs[m];
				}
			}

			return SubLayer;
		}

		return createLayer;
	}.call(this));
	
	/* =========== C L A S S ============== */

	var SvgLayer = createLayer('svg', {
		init: function () {
			this.set('width', 960);
			this.set('height', 500);
			this.set('margin', {
				top: 20,
				right: 20,
				bottom: 20,
				left: 40
			});
			this.set('svg', null);
			this.set('class', '');
		},
		width: function () {
			var margin = this.get('margin');
			return this.get('width') - margin.left - margin.right;
		},
		height: function () {
			var margin = this.get('margin');
			return this.get('height') - margin.top - margin.bottom;
		},
		render: function () {
			var ele = this.get('layer');
			if (!ele) {
				ele = this.set('layer', document.body, true);
			}
			var margin = this.get('margin');
			
			var svg = d3.select(ele).append('svg')
				.attr('class', this.get('class'))
				.attr('width', this.get('width'))
				.attr('height', this.get('height'))
			.append('g')
				.attr('transform', translate(margin.left, margin.top));
				
			this.set('dnode', svg);
		}
	});
	
	var AxisLayer = createLayer('axis', {
		init: function () {
			this.set('scale', d3.scale.linear());
			this.set('scaleType', 'linear');
			this.set('domain', null);
			this.set('range', null);
			this.set('orient', 'bottom');
			this.set('layer', null);
			this.set('format', null);
			
			this._axis = d3.svg.axis();
			this._type = null;
		},
		setType: function (type) {
			this._type = type;
		},
		render: function () {
			var layer = this.root();
			
			if (!layer) {
				throw new Error("The parent layer is not set");
			}
			
			var scale = this.get('scale')
				.range(this.get('range'))
				.domain(this.get('domain'));
			
			var axis = this._axis;
			axis.scale(scale).orient(this.get('orient'));
			
			if (this.get('format')) {
				axis.tickFormat(this.get('format'));
			}
			
			var transform = this._type === 'x' ?
				translate(0, layer.height()) : null;
			
			var svg = layer.dnode();
			var dnode = svg.append('g')
				.attr('class', this.get('class') || 'x axis');
			if (transform) {
				dnode.attr('transform', transform);
			}
			
			dnode.call(axis);
			this._axis = axis;
		},
		getAxis: function () {
			return this._axis;
		}
	});

	
	var GridLayer = createLayer('grid', {
		init: function () {
			this.set('class', this._type + ' grid');
			this.set('style', null);
			this.set('axis', null);
			this.set('format', null);

			this._type = null;
		},
		setType: function (type) {
			this._type = type;
		},
		render: function () {
			var layer = this.root();
			
			if (!layer) {
				throw new Error("The parent layer is not set");
			}
			
			var svg = layer.dnode();
			var transform;
			if (this._type === 'x') {
				transform = translate(0, layer.height());
			}
			var dnode = svg.append('g')
				.attr('class', this.get('class'))
			this.set('dnode', dnode);
			
			if (transform) {
				dnode.attr('transform', transform);
			}
			
			// if (this.get('style') && Object.prototype.toString.call(this.get('style')) === '[object Object]') {
			// 	dnode.style(this.get('style'));
			// }
			dnode.style('stroke-dasharray', ('3, 3'));
			
			var axis = this.get('axis');
			if (this._type === 'x') {
				axis.tickSize(-(layer.height()), 0, 0).tickFormat('');
			} else {
				axis.tickSize(-(layer.width()), 0, 0).tickFormat('');
			}
			
			dnode.call(axis);
			
			if (this.get('format')) {
				svg.selectAll('.grid .tick')
					.filter(function (d) {
						return this.get('format')(d) !== '';
					}.bind(this))
					.select('line')
					.classed('em', true);
			}
		}
	});


	var ClipPathLayer = createLayer('clippath', {
		init: function () {
			this.set('id', 1);
			this.set('layer', null);
		},

		id: function () {
			return 'clippath' + this.get('id');
		},

		url: function () {
			return 'url(#' + this.id() + ')';
		},

		render: function () {
			var layer = this.root();
			
			if (!layer) {
				throw new Error("The parent layer is not set");
			}
			
			var svg = layer.dnode();
			var dnode = svg.append('clipPath')
				.attr('id', this.id())
			.append('rect')
			.attr('width', layer.width())
			.attr('height', layer.height());
			
			this.set('dnode', dnode);
		}
	});
	
	var RulerLayer = createLayer('ruler', {
		init: function () {
			this.set('class', 'x ruler hide');
			this.set('y1', 0);
			this.set('y2', 0);
			this.set('style', null);
			this.set('clippath', null);
			this.set('layer', null);
		},
		render: function () {
			var layer = this.root();

			var clippathLayer = this.getLayer('clippath');

			var svg = layer.dnode();
			var dnode = svg.append('line')
				.attr('class', 'x ruler hide')
				.attr('y1', this.get('y1') || layer.height())
				.attr('y2', this.get('y2'))
				.style('stroke-width', 4)
				.attr('clip-path', clippathLayer.url());
			
			this.set('dnode', dnode);
		}
	});

	var DotsLayer = createLayer('dots', {
		init: function () {
			this.set('class', 'dots');
			this.set('dot-class', 'dot');
			this.set('radius', 6);
			this.set('data', null);
		},
		render: function () {
			var svg = this.root().dnode();
			var clipPath = this.getLayer('clippath');

			var xscale = this._master.xscale();
			var yscale = this._master.yscale();
			var y_accessor = this._master.y_accessor();

			var data = this.get('data') ||
				this._master.data();

			// if no data, do not draw the dots
			if (!data) {
				return;
			}

			var self = this;
			var dnode = svg.append('g')
				.datum(data)
				.attr('class', this.get('class'))
				.attr('clip-path', clipPath.url());

			dnode.selectAll(className(this.get('dot-class')))
				.data(data)
			.enter().append('circle')
				.attr('class', function (d, i) {
					return self.get('dot-class') + ' ' + self.get('dot-class') + '-' + i;
				})
				.attr('r', this.get('radius'))
				.attr('cx', function (d, i) {
					return xscale(i);
				})
				.attr('cy', function (d) {
					return yscale(y_accessor(d));
				});

			this.set('dnode', dnode);
		}
	});

	var DataLineLayer = createLayer('data-line', {
		init: function () {
			this.set('class', 'line');
			this.set('fill', 'none');
			this.set('data', null);
			this.set('interpolate', 'linear');
		},
		render: function () {
			var svg = this.root().dnode();

			var xscale = this._master.xscale();
			var yscale = this._master.yscale();
			var y_accessor = this._master.y_accessor();

			var clipPath = this.getLayer('clippath');

			var line = d3.svg.line()
				.interpolate(this.get('interpolate'))
				.x(function (d, i) {
					return xscale(i);
				})
				.y(function (d) {
					return yscale(y_accessor(d));
				});

			var dnode = svg.append('path')
				.datum(this.get('data') || this._master.data())
				.attr('class', this.get('class'))
				.attr('clip-path', clipPath.url())
				.attr('fill', this.get('fill'))
				.attr('d', line);

			this.set('dnode', dnode);
			this.set('line', line);
		}
	});


	var EventAreaLayer = createLayer('event-area', {
		init: function () {
			this.set('class', 'eventarea');
			this.set('style', {
				'pointer-events': 'all'
			});
			this.set('mouseover', null);
			this.set('mouseout', null);
			this.set('mousemove', null);
		},

		render: function () {
			var layer = this.root();
			var svg =layer.dnode();

			var eventarea = svg.append('g')
				.attr('class', this.get('class'))
				.style(this.get('style'));

			eventarea.append('rect')
				.attr('width', layer.width())
				.attr('height', layer.height())
				.style('visibility', 'hidden');

			this.set('dnode', eventarea);

			if (this.get('mouseover')) {
				eventarea.on('mouseover', this.get('mouseover'));
			}
			if (this.get('mouseout')) {
				eventarea.on('mouseout', this.get('mouseout'));
			}
			if (this.get('mousemove')) {
				eventarea.on('mousemove', this.get('mousemove'));
			}
		}
	});

	var DotBarsLayer = createLayer('dot-bars', {
		init: function () {
			this.set('class', 'dot-bars');
			this.set('data', null);
			this.set('bar-class', 'dot-bar');
			this.set('mouseover', null);
			this.set('mouseout', null);
			this.set('mousemove', null);
		},
		render: function () {
			var layer = this.root();
			var svg = layer.dnode();

			var xscale = this._master.xscale();
			var clipPath = this.getLayer('clippath');

			var bar = svg.append('g')
				.datum(this.get('data') || this._master.data())
				.attr('class', this.get('class'))
				.attr('clip-path', clipPath.url())
			.selectAll(this.get('bar-class'))
				.data(this.get('data'))
			.enter().append('rect')
				.attr('class', this.get('bar-class'))
				.attr('data-id', function (d, i) {
					return i;
				})
				.attr('x', function (d, i) {
					return xscale(i) - 6;
				})
				.attr('y', 0)
				.attr('width', 12)
				.attr('height', layer.height())
				.style('fill', 'transparent')

			this.set('dnode', bar);

			if (this.get('mouseover')) {
				bar.on('mouseover', this.get('mouseover'));
			}
			if (this.get('mouseout')) {
				bar.on('mouseout', this.get('mouseout'));
			}
			if (this.get('mousemove')) {
				bar.on('mousemove', this.get('mousemove'));
			}
		}
	})
			
	/* =========== C L A S S ============== */
	
	var _id = 0;
	
	function Trach (name, data, element, options) {
		var _name = null;
		if (typeof name !== 'string') {
			_name = '';
		}
		
		this._id = _id++;
		
		data = data || {};
		data = Object.assign({}, __DATA__, data);
		
		if (!element) {
			element = document.body;
		}
		
		options = options || {};
		options = Object.assign({}, __OPTIONS__, options);
		
		this.init(_name === null ? name : _name, data, element, options);
	}

	Trach.createLayer = createLayer;
	
	Trach.prototype.init = function (name, data, element, options) {
		this._name = name;
		this._data = data;
		this._element = element;
		this._options = options;
		this._d3 = {};
		this._layers = [];
		this._rootIndex = 0;
		this._canConfig = false;
	}

	/**
	 * Get the index for the root layer.
	 */
	Trach.prototype.getRootIndex = function () {
		return this._rootIndex;
	}

	/**
	 * Get the layer by the layer's name
	 * @param {string} layerName
	 */
	Trach.prototype.getLayer = function (layerName) {
		if (layerName === null || layerName === undefined) { return null; }

		if (typeof layerName === 'number') {
			if (layerName < this._layers.length && layerName >= 0) {
				return this._layers[layerName];
			}
			return null;
		}
		
		var index;
		if (typeof layerName === 'number' && layerName >= 0 && layerName < this._layers.length) {
			index = layerName;
		} else {
			index = this.getLayerIndex(layerName);
		}

		return index === -1 ? null : this._layers[index];
	}

	Trach.prototype.getLayerIndex = function (layerName) {
		if (typeof layerName !== 'string') {
			throw new TypeError("Invalid argument");
		}
		if (!layerName) { return null; }

		for (var i = 0, layer; i < this._layers.length; i++) {
			layer = this._layers[i];
			if (layer.name === layerName) {
				return i;
			}
		}
		
		return -1;
	}

	/**
	 * Add a layer.
	 * @param {object} layer - The layer.
	 * @param {string|object} before - The layer before the added layer.
	 */
	Trach.prototype.addLayer = function (layer, before) {
		if (!before) {
			return this._layers.push(layer) - 1;
		}

		var name;
		var index;

		name = (before instanceof Layer) ? before.name : before;
		index = this.getLayerIndex(name);
		if (index === -1) {
			throw new Error("Can not find the layer: " + name + " in addLayer");
		}
		this._layers.splice(index + 1, 0, layer);

		return index + 1;
	}

	/**
	 * Remove a layer.
	 */
	Trach.prototype.removeLayer = function (layer) {
		var name = layer instanceof Layer ? layer.name : layer;
		var index = this.getLayerIndex(name);

		if (index === -1) { return; }
		this._layers.splice(index, 1);
	}
	
	// draw the chart
	Trach.prototype.render = function () {
		var options = this._options;
		
		var svgLayer = new SvgLayer(this);
		svgLayer.set('layer', this._element);
		svgLayer.set('class', this._name);
		this._rootIndex = this.addLayer(svgLayer);

		if (options.margin) {
			svgLayer.set('margin', options.margin || svgLayer.get('margin'));	
		}
		if (options.width) {
			svgLayer.set('width', options.width);
		}
		if (options.height) {
			svgLayer.set('height', options.height);
		}

		svgLayer.render();

		var padding = this._options.padding || 20;
		
		/** axis */
		var xAxisLayer = new AxisLayer(this);
		xAxisLayer.setType('x');
		xAxisLayer.set('scale', this.xscale());
		xAxisLayer.set('domain', d3.extent(this.data(), this._options.x_accessor));
		xAxisLayer.set('range', [padding, svgLayer.width() - padding]);
		if (options.x_format) {
			xAxisLayer.set('format', options.x_format);
		}
		this.addLayer(xAxisLayer);
		
		var yAxisLayer = new AxisLayer(this);
		yAxisLayer.setType('y');
		yAxisLayer.set('scale', this.yscale());
		yAxisLayer.set('domain', d3.extent(this.data(), this._options.y_accessor));
		yAxisLayer.set('range', [svgLayer.height() - padding, padding]);
		yAxisLayer.set('class', 'y axis');
		yAxisLayer.set('orient', 'left');
		if (options.y_format) {
			yAxisLayer.set('format', options.y_format);
		}
		this.addLayer(yAxisLayer);
		
		/** grid */
		var xGrid, yGrid;
		if (options.grid) {
			xGrid = new GridLayer(this);
			xGrid.setType('x');
			xGrid.set('axis', xAxisLayer.getAxis());
			if (options.x_format) {
				xGrid.set('format', options.x_format);
			}
			this.addLayer(xGrid);

			yGrid = new GridLayer(this);
			yGrid.setType('y');
			yGrid.set('axis', yAxisLayer.getAxis());
			if (options.y_format) {
				yGrid.set('format', options.y_format);
			}
			this.addLayer(yGrid);
		}

		/*
			this.layer(ClipPathLayer, function (layer) {
				layer.set('id', this._id);
				layer.set('layer', svgLayer);
			})
		*/
		
		var clippathLayer = new ClipPathLayer(this);
		clippathLayer.set('id', this._id);
		this.addLayer(clippathLayer);
		
		var rulerLayer = new RulerLayer(this);
		this.addLayer(rulerLayer);

		var dataLineLayer = new DataLineLayer(this);
		this.addLayer(dataLineLayer);
		var dotsLayer = new DotsLayer(this);
		// dotsLayer.set('data', this.data())
		this.addLayer(dotsLayer);

		var eventareaLayer = new EventAreaLayer(this);
		this.addLayer(eventareaLayer);

		var dotbarsLayer = new DotBarsLayer(this);
		dotbarsLayer.set('data', this.data());
		this.addLayer(dotbarsLayer);

		/* ========== B O T T O M ========= */
		// config middleware
		if (this._options.config && typeof this._options.config === 'function') {
			this._canConfig = true;
			this._options.config(this);
		}

		// render the layers
		for (var i = this._rootIndex + 1, l; i < this._layers.length; i++) {
			l = this._layers[i];
			l.render();
		}
	}
	
	Trach.prototype.xscale = function () {
		if (!this._d3.xScale) {
			var scaleFn = this.getScaleFn('x');
			this._d3.xScale = scaleFn();
		}
		
		return this._d3.xScale;
	}
	
	Trach.prototype.yscale = function () {
		if (!this._d3.yScale) {
			var scaleFn = this.getScaleFn('y');
			this._d3.yScale = scaleFn();
		}
		
		return this._d3.yScale;
	}
	
	Trach.prototype.getScaleFn = function (type) {
		if (type !== 'x' && type !== 'y') {
			throw new TypeError("Invalid arguments");
		}
		
		var key = type === 'x' ? 'xScale' : 'yScale';
		if (! (this._data[key] in d3.scale)) {
			throw new TypeError("Invalid arguments");
		}
		
		return d3.scale[this._data[key]];
	}
	
	Trach.prototype.data = function () {
		return this._data.main;
	}

	Trach.prototype.setData = function (data) {
		this._data.main = data;
	}

	Trach.prototype.redraw = function () {
		var root = this.getLayer('svg');
		if (root && root.dnode()) {
			root.dnode().remove();
		}
		this._layers = [];
		this.render();
	}

	Trach.prototype.x_accessor = function () {
		return this._options.x_accessor;
	}

	Trach.prototype.y_accessor = function () {
		return this._options.y_accessor;
	}

	/**
	 * Config specific layer.
	 * @param {string} name - The name of the layer.
	 * @param {array} deps - The dependencies of the config.
	 * 	Note, that the deps must be all available.
	 * @param {function} fn - The config function.
	 */
	Trach.prototype.config = function (name, deps, fn) {
		if (!this._canConfig) {
			throw new Error("Please run this function in the `config` option");
		}

		if (!name) {
			throw new TypeError("Invalid arguments");
		}

		if (typeof deps === 'function') {
			fn = deps;
			deps = [];
		}

		var configLayer = this.getLayer(name);
		if (!configLayer) {
			throw new Error("Can not find this layer: " + name);
		}

		var depLayers = [];
		var depName;
		for (var i = 0; i < deps.length; i++) {
			depName = deps[i];
			depLayers.push(this.getLayer(depName));
		}

		fn.apply(configLayer, depLayers);
	}

	var _plugins = {};

	/**
	 * Trach plugin
	 */
	function plugin (name, factory) {
		if (!factory) {
			return _getPlugin(name);
		}

		_addPlugin(name, factory);
	}

	/**
	 * Add plugin
	 * @param {string} name - The Plugin name
	 * @param {function} factory - The Plugin factory
	 */
	function _addPlugin (name, factory) {
		var plugins = _plugins;

		if (name in plugins) {
			throw new Error("Plugin already added");
		}

		if (typeof factory !== 'function') {
			throw new TypeError("Invalid argument, factory must be a function");
		}

		plugins[name] = {
			name: name,
			factory: factory
		};

		return plugins[name];
	}

	/**
	 * Get a plugin
	 */
	function _getPlugin (name) {
		if (!name || !(name in _plugins)) {
			throw new Error("No such plugin: " + name);
		} 

		return _plugins[name];
	}
	
	// the only api
	var api = function (name, data, element, options) {
		var trach = new Trach(name, data, element, options);
		
		return trach;
	};

	api.plugin = plugin;

	return api;
}));

(function () {
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

	// Trach.plugin('tooltip', function (args) {
	// 	return new Tooltip(args);
	// });
}.call(this));
