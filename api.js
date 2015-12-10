var controllers = {
		auth: require('./controllers/auth')
	};

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = function(app){

	app
		.post('/register', controllers.auth.register)
		.get('/logout', isAuthenticated, controllers.auth.signout)
		.post('/login', controllers.auth.login)

	return app;

};