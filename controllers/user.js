const passport = require('passport'),
	bCrypt = require('bcrypt-nodejs'),
	User = require('../models/user'),
	resources = require('../app/resources'),
	fs = require('fs');

var createHash = (password) => {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	},
	isValidPassword = (user, password) => {
		return bCrypt.compareSync(password, user.password);
	};

module.exports = {

	register: passport.authenticate('register', {
		successRedirect: '/',
		failureRedirect: '/register',
		failureFlash: true
	}),

	_register: (req, email, password, done) => {
		process.nextTick(function(){
			User.findOne({'email': email}, function(err, user){
				if (err) return done(err);
				if (user) {
					return done(null, false, req.flash('message', {type: 'error', message: 'User Already Exists'}));
				} else {
					var newUser = new User();
					newUser.email = email;
					newUser.password = createHash(password);
					newUser.username = req.body.username;
					if(req.files.avatar) {
						var avatarPath = '/images/avatars/'+newUser._id+'.'+req.files.avatar.originalFilename.split('.')[1];
						newUser.avatar = avatarPath;
						fs.readFile(req.files.avatar.path, (err, data) => {
							fs.writeFile(resources.dirname+'/assets'+avatarPath, data);
						});
					}
					newUser.save(function(err) {
						if (err) return done(err);
						return done(null, newUser);
					});
				}
			});
		});
	},

	login: passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}),

	_login: (req, email, password, done) => { 
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
	},

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
						req.body[key] = createHash(req.body[key]);
					}
					user[key] = req.body[key];
				}

				if(req.files.avatar) {
					if(user.avatar) {
						fs.unlinkSync(resources.dirname+'/assets'+user.avatar);
					}
					var avatarPath = '/images/avatars/'+user._id+'.'+req.files.avatar.originalFilename.split('.')[1];
					user.avatar = avatarPath;
					fs.readFile(req.files.avatar.path, (err, data) => {
						fs.writeFile(resources.dirname+'/assets'+avatarPath, data);
					});
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