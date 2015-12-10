var express = require('express'),
	nunjucks = require('nunjucks'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	cookieSession = require('cookie-session'),
	flash = require('express-flash'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	database = require('./app/database'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http);

app
	.use(express.static(__dirname + '/assets'))
	.use(cookieSession({
		name: 'session',
		secret: 'itsAMassiveSecret'
	}))
	.use(cookieParser())
	.use(bodyParser.urlencoded({ extended: false }))
	.use(bodyParser.json())
	.use(passport.initialize())
	.use(passport.session())
	.use(flash())
	.use(function (req, res, next) {
		res.locals = {
			loggedIn: req.isAuthenticated()
		};
		if(res.locals.loggedIn) res.locals.user = req.user;
		next();
	});

nunjucks.configure(['./views'], {
	autoescape: true,
    express: app
});

var env = new nunjucks.Environment();
env.addFilter('dump', function(str, count){
	return JSON.stringify(str, null, "\t");
});

mongoose.connect(database.url);

require('./app/routes')(app);
require('./app/api')(app);
require('./app/passport')(passport);

var server = http.listen(3000, 'localhost', function () {
	console.log('http://%s:%s', server.address().address, server.address().port);
});

io.on('connection', function(socket){

	//socket.emit //send-client only
	//io.emit //all clients including sender
	//socket.broadcast.emit //send to all clients except sender
	
	// socket.on('message', function(msg){
		
	// });

	//socket.broadcast.emit('message', 'hello'); //Send to all but current user
	//socket.emit('message', 'hello'); //Send to all users
});