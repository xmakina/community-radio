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
			var avatars = [];
			for(avatar of require('fs').readdirSync('./assets/images/avatars')) {
				avatars.push({
					value: avatar.replace('.gif',''),
					label: avatar.replace('.gif','')
				});
			}
			res.render('register.html', {
				message: req.flash('message'),
				avatars: JSON.stringify(avatars)
			});
		})
		.get('/login', isUnauthenticated, (req, res) => {
			res.render('login.html', {
				message: req.flash('message')
			});
		})
		.get('/settings', isAuthenticated, (req, res) => {
			var avatars = [];
			for(avatar of require('fs').readdirSync('./assets/images/avatars')) {
				avatars.push({
					value: avatar.replace('.gif',''),
					label: avatar.replace('.gif','')
				});
			}
			res.render('settings.html', {
				message: req.flash('message'),
				user: req.user,
				avatars: JSON.stringify(avatars)
			});
		})

	return app;

};