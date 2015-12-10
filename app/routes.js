var isAuthenticated = function (req, res, next) {
		if (req.isAuthenticated()) return next();
		res.redirect('/');
	},
	isUnauthenticated = function(req, res, next){
		if (!req.isAuthenticated()) return next();
		res.redirect('/');
	};

module.exports = function(app){

	app
		.get('/', function(req, res) {
			if(!req.isAuthenticated()){
				res.render('login.html');
			} else {
				res.render('home.html');
			}
		})
		.get('/register', isUnauthenticated, function(req, res) {
			res.render('register.html', {
				message: req.flash('message'),
				avatars: require('fs').readdirSync('./assets/images/avatars')
			});
		})
		.get('/login', isUnauthenticated, function(req, res) {
			res.render('login.html', {
				message: req.flash('message')
			});
		})
		.get('/settings', isAuthenticated, function(req, res) {
			res.render('settings.html', {
				message: req.flash('message'),
				user: req.user,
				avatars: require('fs').readdirSync('./assets/images/avatars')
			});
		})

	return app;

};