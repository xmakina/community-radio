const isAuthenticated = (req, res, next) => {
		if (req.isAuthenticated()) return next();
		res.redirect('/');
	},
	isUnauthenticated = (req, res, next) =>{
		if (!req.isAuthenticated()) return next();
		res.redirect('/');
	};

module.exports = (app) => {

	app
		.get('/', (req, res) => {
			if(!req.isAuthenticated()){
				res.render('login.html');
			} else {
				res.render('home.html');
			}
		})
		.get('/register', isUnauthenticated, (req, res) => {
			res.render('register.html', {
				message: req.flash('message'),
				avatars: require('fs').readdirSync('./assets/images/avatars')
			});
		})
		.get('/login', isUnauthenticated, (req, res) => {
			res.render('login.html', {
				message: req.flash('message')
			});
		})
		.get('/settings', isAuthenticated, (req, res) => {
			res.render('settings.html', {
				message: req.flash('message'),
				user: req.user,
				avatars: require('fs').readdirSync('./assets/images/avatars')
			});
		})

	return app;

};