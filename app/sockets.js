const cookie = require('cookie'),
	cookieParser = require('cookie-parser'),
	Session = require('../models/session'),
	User = require('../models/user'),
	resources = require('./resources'),
	radio = require('../controllers/radio'),
	Timeline = require('../app/timeline'),
	Events = require('./events'),
	io = resources.io;

module.exports = () => {

	io.of('/radio').on('connection', (socket) => {

		var onNewSong = (id, dj) => {
			socket.emit('newSong', {id,dj});
			Events.emit('newSong', id, dj);
		};

		// Audience events
		io.of('/radio').emit('listening');
		Events.emit('socketConnect', socket);
		socket.on('disconnect', () => {
			io.of('/radio').emit('notListening');
			Events.emit('socketDisconnect', socket);
			Timeline.off('newSong', onNewSong);
		});

		// Radio events - passes current song and duration to client on connection
		if(Timeline.currentDj && Timeline.playing) {
			User.findOne({_id: Timeline.currentDj}, (err, user) => {
				socket.emit('songDetails', {
					id: Timeline.playing,
					elapsed: Timeline.elapsed,
					dj: user
				});
			});
		} else if(Timeline.playing) {
			socket.emit('songDetails', {
				id: Timeline.playing,
				elapsed: Timeline.elapsed,
				dj: Timeline.currentDj
			});
		}
		
		Timeline.on('newSong', onNewSong);

	});

	// Map session to socket client and store client id in session store
	io.of('/radio').use((socket, next) => {
		var handshake = socket.request;
		if(handshake.headers.cookie) {
			var cookieData = cookie.parse(handshake.headers.cookie),
			sessionId = cookieParser.signedCookie(cookieData['connect.sid'], 'itsAMassiveSecret');
			Session.findOne({_id: sessionId}, (err, session) => {
				var sessionData = JSON.parse(session.session);
				if(!sessionData || !sessionData.passport || !sessionData.passport.user) return;
				session._socketId = socket.id;
				session.save((err) => {
					User.findOne({_id: sessionData.passport.user._id}, (err, user) => { // Save to user model so we can access it there for mongoose middleware
						user._socketId = session._socketId;
						user.save((err) => {
							next();
						});
					});
				});
			});
		} else {
			next();
		}
	});

}