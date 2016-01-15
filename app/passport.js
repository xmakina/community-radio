const User = require('../models/user'),
	bCrypt = require('bcrypt-nodejs'),
	LocalStrategy = require('passport-local').Strategy,
	resources = require('./resources');

var isValidPassword = (user, password) => {
		return bCrypt.compareSync(password, user.password);
	},
	createHash = (password) => {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

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
		}, function(req, email, password, done){ 
			User.findOne({'email' : email}, function(err, user){
				if (err) return done(err);
				if (!user){
					return done(null, false, req.flash('message', {type: 'error', message: 'User Not found.'}));				 
				}
				if (!isValidPassword(user, password)){
					return done(null, false, req.flash('message', {type: 'error', message: 'Invalid Password'}));
				}
				return done(null, user);
				}
			);
		}));

	resources.passport.use('register', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback : true
		}, function(req, email, password, done){
			findOrCreateUser = function(){
				User.findOne({'email': email}, function(err, user){
					if (err) return done(err);
					if (user) {
						return done(null, false, req.flash('message', {type: 'error', message: 'User Already Exists'}));
					} else {
						var newUser = new User();
						newUser.email = email;
						newUser.password = createHash(password);
						newUser.username = req.body.username;
						newUser.save(function(err) {
							if (err) return done(err);
							return done(null, newUser);
						});
					}
				});
			};
			process.nextTick(findOrCreateUser);
		}));

}