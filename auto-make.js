#!/usr/local/bin/node

var fs = require('fs');
var less = require('less');
var UglifyJS = require("uglify-js");



function LESS(filename) {
	var file = fs.readFileSync(filename, {
		encoding: 'utf8'
	});
	less.render(file, {
			// paths: ['.', './lib'], // Specify search paths for @import directives
			filename: filename, // Specify a filename, for better error messages
			compress: true // Minify CSS output
		},
		function(e, output) {
			// console.log(output.css);
			var newname = filename.replace('.less', '.min.css');
			console.log(filename, '->', newname);
			fs.writeFile(newname, output.css, 'utf-8');
		});
}

function JS(filename) {
	if (filename.substr(-7) === '.min.js') return;
	var result = UglifyJS.minify(filename);
	var newname = filename.replace('.js', '.min.js');
	// console.log(filename, '\n', '->', newname, '\n');
	console.log(newname);
	fs.writeFile(newname, result.code, 'utf-8');
}


function HTML(filename) {
	if (filename.substr(-9) === '.min.html') return;
	var minify = require('html-minifier').minify;
	var file = fs.readFileSync(filename, {
		encoding: 'utf8'
	});
	var result = minify(file, {
		minifyJS: true,
		minifyCSS: true,
		removeComments: true,
		collapseWhitespace: true
			// removeAttributeQuotes: true
	});
	var newname = filename.replace('.html', '.min.html');
	console.log(newname);
	fs.writeFile(newname, result, 'utf-8');
}



console.log('waiting for changes');
fs.watch("/", {
	recursive: true
}, function(event, filename) {
	if (filename.substr(-5) === '.less') LESS(filename);
	if (filename.substr(-3) === '.js') JS(filename);
	if (filename.substr(-5) === '.html') HTML(filename);
});