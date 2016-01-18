"use strict";

const User = require('../models/user'),
	Playlist = require('../models/playlist');

module.exports = {

	list: (req, res) => {
		User.findOne({_id: req.params.guid})
			.populate('playlists')
			.exec((err, user) => {
				if(err) {
					res.status(400);
					res.send(err);
				} else {
					res.send(user.playlists);
				}
			});
	},

	update: (req, res) => {
		Playlist.findOne({_id: req.params.id})
			.exec((err, playlist) => {
				if(err) {
					res.status(400);
					res.send(err);
				} else {
					playlist.name = req.body.name;
					playlist.songs = JSON.parse(req.body.songs);
					playlist.save((err, playlist) => {
						if(err) {
							res.status(400);
							res.send(err);
						} else {
							res.send(playlist);
						}
					})
				}
			});
	},

	delete: (req, res) => {
		Playlist.findOne({_id: req.params.id})
			.exec((err, playlist) => {
				if(err) {
					res.status(400);
					res.send(err);
				} else if(playlist) {
					playlist.remove();
					User.findOne({_id: req.session.passport.user._id}, (err, user) => {
						if(err) {
							res.status(400);
							res.send(err);
						} else {
							user.playlists.splice(user.playlists.indexOf(req.params.id), 1);
							user.save((err) => {
								if(err) {
									res.status(400);
								} else {			
									res.send(true);
								}
							});
						}
					});
				}
			});
	},

	create: (req, res) => {
		var playlist = new Playlist();
		playlist.name = req.body.name;
		playlist.songs = JSON.parse(req.body.songs);
		playlist.user = req.session.passport.user._id;
		playlist.save((err, playlist) => {
			if(err) {
				res.status(400);
				res.send(err);
			} else {
				User.findOne({_id: req.session.passport.user._id}, (err, user) => {
					if(err) {
						res.status(400);
						res.send(err);
					} else {
						user.playlists.push(playlist._id);
						user.save((err) => {
							if(err) {
								res.status(400);
							} else {
								res.send(playlist);
							}
						});
					}
				});
			}
		});
	}

};