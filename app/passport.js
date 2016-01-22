const User = require('../models/user'),
	controller = require('../controllers/user'),
	bCrypt = require('bcrypt-nodejs'),
	LocalStrategy = require('passport-local').Strategy,
	resources = require('./resources');

module.exports = () => {

	resources.passport.serializeUser(function(user, done){
		done(null, user);
	});
	 
	resources.passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	resources.passport.use('login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback : true
		}, controller._login));

	resources.passport.use('register', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback : true
		}, controller._register));

}