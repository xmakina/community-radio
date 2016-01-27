const passport = require('passport'),
	bCrypt = require('bcrypt-nodejs'),
	User = require('../models/user'),
	resources = require('../app/resources'),
	fs = require('fs'),
	crypto = require('crypto');

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
			User.findOne({$and: [
			{ $or: [{email: email}, {username: req.body.username}] },
		]}, function(err, user){
				if (err) return done(err);
				if (user) {
					return done(null, false, req.flash('message', {type: 'error', message: 'Username or email address already in use.'}));
				} else {
					var newUser = new User();
					newUser.email = email;
					newUser.password = createHash(password);
					newUser.username = req.body.username;
					if(req.files && req.files.avatar) {
						var fileType = req.files.avatar.originalFilename.split('.')[1];
						if(fileType) {
							fileType = fileType.toLowerCase();
							if(fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'jpg' && fileType !== 'gif') {
								return done(null, false, req.flash('message', {type: 'error', message: 'We only accept jpg, png or gif for avatar images'}));
							}
							var avatarPath = '/images/avatars/'+newUser._id+'.'+fileType;
							newUser.avatar = avatarPath;
							fs.readFile(req.files.avatar.path, (err, data) => {
								fs.writeFile(resources.dirname+'/assets'+avatarPath, data);
							});
						}
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
		User.findOne({$and: [
			{ $or: [{email: email}, {username: email}] },
		]}, function(err, user){
			if (err) return done(err);
			if (!user){
				return done(null, false, req.flash('message', {type: 'error', message: 'User not found, is this the correct email or username?'}));				 
			}
			if (!isValidPassword(user, password)){
				return done(null, false, req.flash('message', {type: 'error', message: 'Incorrect password, pease try again or reset your password'}));
			}
			return done(null, user);
		});
	},

	recover: (req, res) => {

		// crypto.randomBytes(20, function(err, buf) { 
		// 	var token = buf.toString('hex');
		// 	User.findOne({ email: req.body.email }, function(err, user){
		// 		if (!user) {
		// 			req.flash('message', {type: 'error', message: 'User not found, is this the correct email or username?'}
		// 			res.send(false);
		// 		}
		// 		user.resetPasswordToken = token;
		// 		user.resetPasswordExpires = Date.now() + 3600000;
		// 		user.save(function(err) {
		// 			done(err, token, user);
		// 			var smtpTransport = nodemailer.createTransport('SMTP', {
		// 				service: 'SendGrid',
		// 				auth: {
		// 					user: '!!! YOUR SENDGRID USERNAME !!!',
		// 					pass: '!!! YOUR SENDGRID PASSWORD !!!'
		// 				}
		// 			});
		// 			var mailOptions = {
		// 				to: user.email,
		// 				from: 'passwordreset@demo.com',
		// 				subject: 'Node.js Password Reset',
		// 				text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
		// 				'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
		// 				'http://' + req.headers.host + '/reset/' + token + '\n\n' +
		// 				'If you did not request this, please ignore this email and your password will remain unchanged.\n'
		// 			};
		// 				smtpTransport.sendMail(mailOptions, function(err) {
		// 				req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
		// 				done(err, 'done');
		// 			});
		// 		});
		// 	});
		// });
		res.send();
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

				if(req.files && req.files.avatar) {
					var fileType = req.files.avatar.originalFilename.split('.')[1];
					if(fileType) {
						fileType = fileType.toLowerCase();
						if(fileType !== 'png' && fileType !== 'jpeg' && fileType !== 'jpg' && fileType !== 'gif') {
							return done(null, false, req.flash('message', {type: 'error', message: 'We only accept jpg, png or gif for avatar images'}));
						}
						if(user.avatar) fs.unlinkSync(resources.dirname+'/assets'+user.avatar);
						var avatarPath = '/images/avatars/'+user._id+'.'+fileType;
						user.avatar = avatarPath;
						fs.readFile(req.files.avatar.path, (err, data) => {
							fs.writeFile(resources.dirname+'/assets'+avatarPath, data);
						});
					}
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
	},

	removeAvatar: (req,res) => {
		User.findOne({_id: req.session.passport.user._id}, (err, user) => {
			if(err) {
				req.flash('message', {type: 'error', message: 'User Not found.'});
				res.status(400);
				res.send(err);
			} else if(!user) {
				res.status(400);
				res.send('no user');
			} else {
				if(user.avatar) fs.unlinkSync(resources.dirname+'/assets'+user.avatar);
				user.avatar = null;
				user.save((err) => {
					if(err) {
						req.flash('message', {type: 'error', message: 'Unable to save user'});
						res.status(400);
						res.send(err);
					}
					req.login(user, function(err) {
						req.flash('message', {type: 'message', message: 'User updated.'});
						res.send(true);
					});
				});
			}
		});
	}

};