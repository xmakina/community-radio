const url = require('url'),
	cookie = require('cookie'),
	cookieParser = require('cookie-parser'),
	Session = require('../models/session'),
	resources = require('./resources'),
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
					next();
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

		});

	});

}