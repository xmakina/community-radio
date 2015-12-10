var User = require('./models/user'),
	bCrypt = require('bcrypt-nodejs'),
	LocalStrategy = require('passport-local').Strategy;

var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	},
	createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

module.exports = function(passport){

	passport.serializeUser(function(user, done){
		done(null, user._id); 
	});
	 
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

	passport.use('login', new LocalStrategy({passReqToCallback : true}, function(req, username, password, done){ 
		User.findOne({'username' : username}, function(err, user){
			if (err) return done(err);
			if (!user){
				return done(null, false, req.flash('message', 'User Not found.'));				 
			}
			if (!isValidPassword(user, password)){
				return done(null, false, req.flash('message', 'Invalid Password'));
			}
			return done(null, user);
			}
		);
	}));


	passport.use('register', new LocalStrategy({passReqToCallback : true}, function(req, username, password, done){
		findOrCreateUser = function(){
			User.findOne({'username':username},function(err, user){
				if (err) return done(err);
				if (user) {
					return done(null, false, req.flash('message', 'User Already Exists'));
				} else {

					var newUser = new User();
					newUser.username = username;
					newUser.password = createHash(password);
					newUser.email = req.params.email;

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