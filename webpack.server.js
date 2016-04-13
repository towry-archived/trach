
var WebpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');

var compiler = webpack(require('./webpack.config'));

var server = new WebpackDevServer(compiler, {
	contentBase: __dirname + '/sandbox',
	hot: true,
	publicPath: "/static/",
	filename: "bundle.js"
});

server.listen(8080, "localhost", function() {});
