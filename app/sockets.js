var url = require('url'),
	cookie = require('cookie'),
	cookieParser = require('cookie-parser'),
	Session = require('../models/session');

module.exports = (io, app) => {

	io.of('/radio').use(function (socket, next) {
		var handshake = socket.request;
		if(handshake.headers.cookie) {
			var cookieData = cookie.parse(handshake.headers.cookie),
			sessionId = cookieParser.signedCookie(cookieData['connect.sid'], 'itsAMassiveSecret');

			Session.findOne({_id: sessionId}, function(err, data){
				handshake.session = JSON.parse(data.session);
				next();
			});
		} else {
			next();
		}
	});

	io.of('/radio').on('connection', (socket) => {

		var userData = {};
		if(socket.request.session) {
			var session = socket.request.session;
			if(session.passport && session.passport.user) {
				userData.username = session.passport.user.username;
				userData.avatar = session.passport.user.avatar
			}
		}

		io.of('/radio').emit('listening', userData);

		socket.on('disconnect', () => {
			io.of('/radio').emit('notListening', userData);
		});

	});

}