"use strict";

const Session = require('../models/session'),
	cookie = require('cookie'),
	cookieParser = require('cookie-parser'),
	User = require('../models/user'),
	Timeline = require('../app/timeline'),
	resources = require('../app/resources'),
	sessionStore = resources.sessionStore,
	io = resources.io;

module.exports = {

	joinQueue: (req, res) => {
		User.findOne({_id: req.session.passport.user._id}, (err, user) => {
			if(!user.activePlaylist) {
				res.status(400);
				res.send('please activate a playlist');
				return;
			}
			user.inQueue = true;
			user.save((err) => {
				if(err) {
					res.status(400);
					res.send(err);
				} else {
					res.send(true);
				}
			})
		});
	},

	leaveQueue: (req, res) => {
		User.findOne({_id: req.session.passport.user._id}, (err, user) => {
			user.inQueue = true;
			user.save((err) => {
				if(err) {
					res.status(400);
					res.send(err);
				} else {
					res.send(true);
				}
			})
		});
	},

	userLeavingRoom: (socket) => {
		if(!socket.id) return;
		Session.findOne({
			_socketId: socket.id
		}).exec((err, data) => {
			if(!data) return;
			var session = JSON.parse(data.session);
			if(!session && !session.passport && !session.passport.user) return;
			User.findOne({_id: session.passport.user._id}, (err, user) => {
				user.isConnected = false;
				user.save();
				if(user.inQueue) {
					// Check session again after 10 minutes
					setTimeout(() => {
						User.findOne({_id: session.passport.user._id}, (err, user) => {
							if(!user.isConnected && user.inQueue) {
								user.inQueue = false;
								user.save();
							}
						});
					}, 10 * 60 * 1000);
				}
			});
		});
	},

	userEnteringRoom: (socket) => {
		if(!socket.id) return;
		Session.findOne({
			_socketId: socket.id
		}).exec((err, data) => {
			if(!data) return;
			var session = JSON.parse(data.session);
			if(!session && !session.passport && !session.passport.user) return;
			User.findOne({_id: session.passport.user._id}, (err, user) => {
				user.isConnected = true;
				user.save();
			});
		});
	},

	listening: (req, res) => {

		var clientIds = [];
		for (var id in io.of('/radio').connected) {
			clientIds.push(id);
		}

		Session.find({
			_socketId: { $in: clientIds }
		}).exec((err, sessions) => {

			if(err){
				res.status(400);
				res.send(err);
			}

			var users = [];
			for(var i=0;i<sessions.length;i++){
				var session = JSON.parse(sessions[i].session);
				if(session.passport && session.passport.user && session.passport.user.username) {
					users.push({
						username: session.passport.user.username
					});
				}
			}

			res.send(users);

		});

	}

};