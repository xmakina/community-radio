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
			'sBzrzS1Ag_g',
			'pFptt7Cargc',
			'fcISKYecwII',
			'SBjQ9tuuTJQ',
			'mzJj5-lubeM',
			'00bk5E7gecI',
			'tIdIqbv7SPo',
			'R7UrFYvl5TE',
			'oVslvM30EWI'
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

		// Refactor this - shouldn't be invoking so many dates
		this.startsAt = new Date();
		this._getSongLength(id, (data) => {

			this.endsAt = new Date();

			var now = new Date();
			this.endsAt = new Date(now.getTime() + (data.seconds*1000));
			this.endsAt = new Date(this.endsAt.getTime() + (data.minutes*60000));
			
			this.playing = id;

			if(this.callbacks.newSong) {
				for(var callback of this.callbacks.newSong){
					callback(id);
				}
			}

		});

	}

	_getVideoData(id, callback) {
		var url = 'https://www.googleapis.com/youtube/v3/videos?id='+id+'&part=contentDetails,status&key='+this.opts.youtubeApiKey,
			self = this;
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body);
				if(!data.items[0].status.embeddable) {
					self._nextSong();
				} else {
					callback(data);
				}
			}
		});
	}

	_getSongLength(id, callback) {
		this._getVideoData(id, function(data) {
			var duration = data.items[0].contentDetails.duration.replace('PT', ''),
				minutes = duration.split('M')[0],
				seconds = duration.split('M')[1].replace('S', '');
			callback({
				minutes: minutes,
				seconds: seconds
			});
		});
	}

	_nextSong() {
		this.elapsed = 0;
		var index = this.defaultPlaylist.indexOf(this.playing),
			nextSong = index > this.defaultPlaylist.length ? this.defaultPlaylist[0] : this.defaultPlaylist[1 + index];
		this.playSong(nextSong);
		this.playing = false;
	}

	_nextTick() {
		if(!this.playing) return;
		var now = new Date();

		if(now.getTime() > this.endsAt.getTime()) {
			this._nextSong();
		} else {
			this.elapsed = Math.abs((this.startsAt.getTime() - now.getTime()) / 1000);
		}
	}

}

module.exports = new Timeline();