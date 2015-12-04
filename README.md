# Trach

A simple d3 based chart library.

## Usage

Create a new chart

``` javascript
var name = 'myChart';
var data = {
  main: [1,2,34,5,6]
};
var ele = document.body;
var options = {
  grid: true,
  config: function (trach) {
	var svgLayer = trach.getLayer('svg');
    svgLayer.set('width', 500);
  }
}

var trach = new Trach(name, data, ele, options);

// draw the chart
trach.render();
```







---

© 2015, Towry Wang