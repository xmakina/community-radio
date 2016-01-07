const Session = require('../models/session'),
	io = require('../app/resources').io;

module.exports = {

	listening: (req, res) => {

		var clients = io.of('/radio').connected,
			users = [],
			wasSet = [];

		for (var id in clients) {
			if(wasSet.indexOf(clients[id].request.user.username) == -1) {
				users.push(clients[id].request.user);
				wasSet.push(clients[id].request.user.username);
			}
		}

		res.send(users);

	}

};