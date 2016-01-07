"use strict";

const request = require('request');

class Timeline {

	constructor(opts) {

		if(!opts) opts = {};
		this.opts = Object.assign({}, opts, {
			refreshInterval: 1000,
			youtubeApiKey: 'AIzaSyABtT6HgNEXwI2tJwN7C43QXfyV9Km7fkU'
		});

		this.defaultPlaylist = [
			'hbb09MRR-Q4',
			'6Z66wVo7uNw',
			'mzJj5-lubeM',
			'tIdIqbv7SPo'
		];

		this.callbacks = {};

		this.playSong(this.defaultPlaylist[0]);

		this.tracker = setInterval(this._nextTick.bind(this), this.opts.refreshInterval);

	}

	on(event, callback) {
		if(this.callbacks[event]) {
			this.callbacks[event].push(callback);
		} else {
			this.callbacks[event] = [callback];
		}
	}

	playSong(id) {

		this.startsAt = new Date();
		this._getSongLength(id, (data) => {

			this.endsAt = new Date();
			this.endsAt.setSeconds(this.endsAt.getSeconds() + data.seconds);
			this.endsAt.setMinutes(this.endsAt.getMinutes() + data.minutes);

			this.playing = id;

			if(this.callbacks.newSong) {
				for(var callback of this.callbacks.newSong){
					callback(id);
				}
			}

		});

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
		if(!this.playing) return;
		var now = new Date();
		if(now > this.endsAt) {
			this.elapsed = 0;
			this.playing = false;
			this.playSong(this.defaultPlaylist[this.defaultPlaylist.indexOf(this.playing) + 1]);
		} else {
			this.elapsed = Math.abs((this.startsAt.getTime() - now.getTime()) / 1000);
			console.log(this.elapsed);
		}
	}

}

module.exports = new Timeline();