"use strict";

const Session = require('../models/session'),
	cookie = require('cookie'),
	cookieParser = require('cookie-parser'),
	User = require('../models/user'),
	Timeline = require('../app/timeline'),
	resources = require('../app/resources'),
	Events = require('../app/events'),
	sessionStore = resources.sessionStore,
	io = resources.io;

module.exports = {

	inRoom: 0,

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
					Events.emit('joiningQueue', user);
					res.send(true);
				}
			})
		});
	},

	leaveQueue: (req, res) => {
		User.findOne({_id: req.session.passport.user._id}, (err, user) => {
			user.inQueue = false;
			user.save((err) => {
				if(err) {
					res.status(400);
					res.send(err);
				} else {
					Events.emit('leavingQueue', user);
					res.send(true);
				}
			})
		});
	},

	forceNext: (req, res) => {
		if(req.session && req.session.passport && req.session.passport.user && req.session.passport.user.username == 'simon') {
			Timeline._getNextSong();
			res.send(true);
		} else {
			res.send('your on not simon');
		}

	},

	userLeavingRoom: (socket) => {
		this.inRoom--;
		if(this.inRoom === 0) {
			Timeline.noUsers();
		}
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
					// Check session again after 1 minute
					setTimeout(() => {
						User.findOne({_id: session.passport.user._id}, (err, user) => {
							if(!user.isConnected && user.inQueue) {
								user.inQueue = false;
								user.save((err) => {
									Events.emit('leavingQueue', user);
								});
							}
						});
					}, 1 * 60 * 1000);
				}
			});
		});
	},

	userEnteringRoom: (socket) => {
		if(Timeline.running) {
			Timeline.hasUsers();
		}
		this.inRoom++;
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
						username: session.passport.user.username,
						avatar: session.passport.user.avatar
					});
				}
			}

			res.send(users);

		});

	}

};