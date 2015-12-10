var passport = require('passport'),
	bCrypt = require('bcrypt-nodejs'),
	User = require('../models/user');

module.exports = {

	register: passport.authenticate('register', {
		successRedirect: '/',
		failureRedirect: '/register',
		failureFlash: true
	}),

	login: passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}),

	logout: function(req, res) {
		req.logout();
		res.redirect('/');
	},

	update: function(req, res) {
		User.findOne({username: req.body.username}, function(err, user){
			if(err) {
				req.flash('message', {type: 'error', message: 'User Not found.'});
				res.status(400);
				res.send(err);
			}
			user.username = req.body.username;
			user.email = req.body.email;
			user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
			user.avatar = req.body.avatar;
			user.save(function(err) {
				if(err) {
					req.flash('message', {type: 'error', message: 'Unable to save user'});
					res.status(400);
					res.send(err);
				}
				req.flash('message', {type: 'message', message: 'User updated.'});
				res.redirect('/settings');
			});
		});
	}

};