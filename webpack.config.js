const path = require("path");

module.exports = {
	context: __dirname,
	entry: "./src/index.jsx",
	output: {
		path: path.resolve(__dirname, "docs"),
		filename: "index.js"
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			loaders: ["babel-loader"]
		}]
	}
};