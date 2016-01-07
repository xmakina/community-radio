'use strict';

const resources = require('./resources'),
	app = resources.app;

const controllers = {
		user: require('../controllers/user'),
		radio: require('../controllers/radio')
	};

const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = () => {

	app

		// Auth layer api
		.post('/register', controllers.user.register)
		.post('/login', controllers.user.login)
		.post('/settings', isAuthenticated, controllers.user.update)
		.get('/logout', isAuthenticated, controllers.user.logout)

		// Radio api
		.get('/radio/listening', controllers.radio.listening)

	return app;

};