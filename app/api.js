'use strict';

const resources = require('./resources'),
	app = resources.app;

const controllers = {
		user: require('../controllers/user'),
		radio: require('../controllers/radio'),
		playlists: require('../controllers/playlists'),
		youtube: require('../controllers/youtube')
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
		.post('/forgot-password', controllers.user.recover)
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

		// Media
		.get('/media/details/:id', controllers.youtube.details)
		.get('/media/search/:keyword', controllers.youtube.search)

		.get('/nextSong', controllers.radio.forceNext);


	return app;

};