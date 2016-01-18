"use strict";

const Session = require('../models/session'),
	Queue = require('../models/queue'),
	Timeline = require('../app/timeline'),
	io = require('../app/resources').io;

module.exports = {

	joinQueue: (req, res) => {

		Queue.findOne({name: 'global'}, (err, queue) => {
			if(!queue) {
				queue = new Queue();
				queue.name = 'global';
				queue.djs = [req.session.passport.user._id];
			} else if(queue.djs.indexOf(req.session.passport.user._id) === -1) {
				queue.djs.push(req.session.passport.user._id);
			} else {
				res.send('user already in queue');
				return;
			}
			queue.save((err, queue) => {
				if(err) {
					res.status(400);
					res.send(err);
				} else {
					res.send(queue);
				}
			});
		});


	},

	leaveQueue: (req, res) => {
		if(!res) return;
		Queue.findOne({name: 'global'}, (err, queue) => {
			if(queue) {
				queue.djs.splice(queue.djs.indexOf(req.session.passport.user._id), 1);
			} else {
				res.send('user not in queue');
				return;
			}
			queue.save((err, queue) => {
				if(err) {
					res.status(400);
					res.send(err);
				} else {
					res.send(queue);
				}
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