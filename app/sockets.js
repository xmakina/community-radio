var url = require('url'),
	cookie = require('cookie'),
	cookieParser = require('cookie-parser');

module.exports = (io, app, redisClient) => {

    io.of('/radio').use(function (socket, next) {
    	var handshake = socket.request;
        if(handshake.headers.cookie) {
            var cookieData = cookie.parse(handshake.headers.cookie),
            	sessionId = cookieParser.signedCookie(cookieData['connect.sid'], 'itsAMassiveSecret');
            redisClient.get('sess:'+sessionId, function(err, session) {
	        	handshake.session = JSON.parse(session);
	        	next();
	        });
        } else {
        	next();
        }
    });

	io.of('/radio').on('connection', (socket) => {

		var user = socket.request.session.passport.user,
			userData = {
				username: user.username,
				avatar: user.avatar
			};

		io.of('/radio').emit('listening', userData);

		socket.on('disconnect', () => {
			io.of('/radio').emit('notListening', userData);
		});

	});

}