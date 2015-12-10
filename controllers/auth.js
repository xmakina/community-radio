var passport = require('passport');

module.exports = {

	register: passport.authenticate('register', {
		successRedirect: '/',
		failureRedirect: '/register',
		failureFlash: true
	}),

	signout: function(req, res) {
		req.logout();
		res.redirect('/');
	},

	signup: function(req, res){
		
	},

	login: passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/',
		failureFlash : true 
	})
};