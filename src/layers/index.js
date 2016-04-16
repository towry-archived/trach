
var exports = module.exports;

function exportModule(name, path) {
	exports[name[0].toUpperCase() + name.slice(1) + 'Layer'] = require(path);
}

// exports
exportModule('svg', './svg');
