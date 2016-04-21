"use strict";

const request = require('request'),
	apiKey = process.env.GOOGLE_API;

module.exports = {

	details: (req, res) => {
		var url = 'https://www.googleapis.com/youtube/v3/videos?id='+req.params.id+'&part=snippet&key='+apiKey;
		request(url, function (error, response, body) {
			if(error || response.statusCode !== 200) {
				res.status(400);
				res.send(error);
			} else {
				var data = JSON.parse(body);
				res.send(data);
			}
		});
	},

	search: (req, res) => {
		var url = 'https://www.googleapis.com/youtube/v3/search?q='+encodeURIComponent(req.params.keyword)+'&part=snippet&key='+apiKey+'&maxResults=50&type=video&videoEmbeddable=true&videoSyndicated=true'
		request(url, function (error, response, body) {
			if(error || response.statusCode !== 200) {
				res.status(400);
				res.send(error);
			} else {
				var data = JSON.parse(body);
				res.send(data);
			}
		});
	}

};