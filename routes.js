var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('/');
}

module.exports = function(app){

	app
		.get('/register', function(req, res) {
			res.render('register.html', {
				message: req.flash('message'),
				avatars: require('fs').readdirSync('./assets/images/avatars')
			});
		})
		.get('/', function(req, res) {
			if(req.isAuthenticated()){
				res.render('login.html', {title: 'twogether radio', message: req.flash('message')});
			} else {
				res.render('home.html', {title: 'twogether radio', message: req.flash('message')});
			}
		})

	return app;

};