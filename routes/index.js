var express = require('express');
var router = express.Router();
var fs = require('fs');
var http = require('http');
var request = require('request');
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', { root: 'public' });
});

router.get('/movie', function(req, res, next) {
	console.log("Movie requested");
	var title = req.query.title;
	var file = "../public/movies/" + title;
	//console.log("Range: " + req.headers.range);
	//console.log(req);

	fs.readFile(path.resolve(__dirname, file), function(err, data) {
		if (err) {
			throw err;
		}
		//console.log("Range 2: " + req.headers.range);
		var total = data.length;
		var range = req.headers.range;
		var positions =  range.replace(/bytes=/, "").split("-");
		var start = parseInt(positions[0], 10);
		var end = positions[1] ? parseInt(positions[1], 10) : total - 1;
		var chunksize = (end - start) + 1;
		
		console.log("Sending Movie Now..");
		res.writeHead(206, {
				"Content-Range":"bytes " + start + "-" + end + "/" + total,
					"Accept-Ranges":"bytes",
					"Content-Length": chunksize,
					"Content-Type":"video/mp4"
		});
		res.end(data.slice(start, end + 1), "binary");
		console.log("Movie Sent!");	
	});
	
});

module.exports = router;
