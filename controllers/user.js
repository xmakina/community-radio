const passport = require('passport'),
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

	logout: (req, res) => {
		req.logout();
		res.redirect('/');
	},

	update: (req, res) => {
		User.findOne({_id: req.session.passport.user._id}, (err, user) => {
			if(err) {
				req.flash('message', {type: 'error', message: 'User Not found.'});
				res.status(400);
				res.send(err);
			} else if(!user) {
				res.status(400);
				res.send('no user');
			} else {

				for(var key in req.body){
					if(key == 'password'){
						req.body[key] = bCrypt.hashSync(req.body[key], bCrypt.genSaltSync(10), null);
					}
					user[key] = req.body[key];
				}
				
				user.save((err) => {

					if(err) {
						req.flash('message', {type: 'error', message: 'Unable to save user'});
						res.status(400);
						res.send(err);
					}

					// Update session
					req.login(user, function(err) {
						req.flash('message', {type: 'message', message: 'User updated.'});
						res.redirect('/settings');
					});

				});
			}
		});
	}

};