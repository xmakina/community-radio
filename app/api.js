'use strict';

const resources = require('./resources'),
	app = resources.app;

const controllers = {
		user: require('../controllers/user'),
		radio: require('../controllers/radio'),
		playlists: require('../controllers/playlists')
	};

const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = () => {

	// Restful API
	app

		// Auth layer api
		.post('/register', controllers.user.register)
		.post('/login', controllers.user.login)
		.post('/settings', isAuthenticated, controllers.user.update)
		.get('/logout', isAuthenticated, controllers.user.logout)

		// Radio api
		.get('/radio/listening', controllers.radio.listening)
		.post('/radio/join', controllers.radio.joinQueue)
		.get('/radio/leave', controllers.radio.leaveQueue)

		// Playlist api
		.get('/playlists/:guid', controllers.playlists.list)
		.post('/playlists', controllers.playlists.create)
		.post('/playlists/:id', controllers.playlists.update)
		.delete('/playlists/:id', controllers.playlists.delete)


	return app;

};