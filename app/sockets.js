const cookie = require('cookie'),
	cookieParser = require('cookie-parser'),
	Session = require('../models/session'),
	User = require('../models/user'),
	resources = require('./resources'),
	radio = require('../controllers/radio'),
	Timeline = require('../app/timeline'),
	io = resources.io;

module.exports = () => {

	// Map session to socket client and store client id in session store
	io.of('/radio').use((socket, next) => {
		var handshake = socket.request;
		if(handshake.headers.cookie) {
			var cookieData = cookie.parse(handshake.headers.cookie),
			sessionId = cookieParser.signedCookie(cookieData['connect.sid'], 'itsAMassiveSecret');
			Session.findOne({_id: sessionId}, (err, session) => {
				var sessionData = JSON.parse(session.session);
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

	// User joined radio
	io.of('/radio').on('connection', (socket) => {

		// Emit listening event to all clients
		io.of('/radio').emit('listening');

		// User left radio
		socket.on('disconnect', () => {

			// Emit not listening event to all clients
			io.of('/radio').emit('notListening');

			radio.leaveQueue();

		});

		socket.emit('songDetails', {
			id: Timeline.playing,
			elapsed: Timeline.elapsed
		});

		Timeline.on('newSong', (id) => {
			socket.emit('newSong', id);
		});

	});

}