const passport = require('passport'),
	bCrypt = require('bcrypt-nodejs'),
	User = require('../models/user'),
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

		if(req.files.avatar) {
			fs.readFile(req.files.avatar.path, (err, data) => {
				var newPath = '/Users/simon.staton/Documents/Projects/twogether-radio/assets/images/avatars';
				console.log(newPath);
				fs.writeFile(newPath, data, function (err) {
					console.log("made", err);
				});
			});
		}


// { displayImage: 
//    { fieldName: 'displayImage',
//      originalFilename: 'bd13b17d633e8ed1e7d48d623d5daefb.jpeg',
//      path: '/tmp/6rJIyxD3ZFdhZmwbomE_HDIu.jpeg',
//      headers: 
//       { 'content-disposition': 'form-data; name="displayImage"; filename="bd13b17d633e8ed1e7d48d623d5daefb.jpeg"',
//         'content-type': 'image/jpeg' },
//      size: 18136,
//      name: 'bd13b17d633e8ed1e7d48d623d5daefb.jpeg',
//      type: 'image/jpeg' } }
     
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