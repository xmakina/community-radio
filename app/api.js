'use strict';

const controllers = {
		user: require('../controllers/user')
	};

const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = (app) => {

	app
		.post('/register', controllers.user.register)
		.post('/login', controllers.user.login)
		.post('/settings', isAuthenticated, controllers.user.update)
		.get('/logout', isAuthenticated, controllers.user.logout)

	return app;

};