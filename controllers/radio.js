const Session = require('../models/session'),
	io = require('../app/resources').io;

module.exports = {

	listening: (req, res) => {

		var clientIds = [];
		for (var id in io.of('/radio').connected) {
			clientIds.push(id);
		}

		Session.find({
			_socketId: { $in: clientIds }
		}).exec(function(err, sessions){

			if(err){
				res.status(400);
				res.send(err);
			}

			var users = [];
			for(var i=0;i<sessions.length;i++){
				var session = JSON.parse(sessions[i].session);
				users.push({
					username: session.passport.user.username,
					avatar: session.passport.user.avatar
				});
			}

			res.send(users);

		});

	}

};