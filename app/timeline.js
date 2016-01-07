"use strict";

const request = require('request');

class Timeline {

	constructor(opts) {

		if(!opts) opts = {};
		this.opts = Object.assign({}, opts, {
			refreshInterval: 1000,
			youtubeApiKey: 'AIzaSyABtT6HgNEXwI2tJwN7C43QXfyV9Km7fkU'
		});

		this.activeSong = {};
		this.tracker = setInterval(this._nextTick.bind(this), this.opts.refreshInterval);
		
		// Have events for start and end of song
		// Get song length
		// Set 1 second interval to check if song has completed
		// Fire events to clients for next song

		// Need some functionality for watching the queue of people and rotating the songs
		// Get current time of video, if someone joins mid song it will jump them to that part of the song

	}

	_getSongLength(id, callback) {
		var url = 'https://www.googleapis.com/youtube/v3/videos?id='+id+'&part=contentDetails&key='+this.opts.youtubeApiKey
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body),
					duration = data.items[0].contentDetails.duration.replace('PT', ''),
					minutes = duration.split('M')[0],
					seconds = duration.split('M')[1].replace('S', '');
				callback({
					minutes: minutes,
					seconds: seconds
				});
			}
		});
	}

	_nextTick() {
		// Get elapsed time from start of song - check to see if its ended
		// Check length, or do some basic non intensive logic here
	}

}

module.exports = Timeline;