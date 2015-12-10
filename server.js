var express = require('express'),
	nunjucks = require('nunjucks'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	session = require('express-session'),
	flash = require('express-flash'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	database = require('./database'),
	app = express();
	//io = require('socket.io')(app);

app
	.use(express.static(__dirname + '/assets'))
	.use(session({
		secret: 'everybodyLovesAGoodSecret',
		resave: true,
		saveUninitialized: true
	}))
	.use(cookieParser())
	.use(bodyParser.urlencoded({ extended: false }))
	.use(bodyParser.json())
	.use(passport.initialize())
	.use(passport.session())
	.use(flash());

nunjucks.configure(['./views'], {
	autoescape: true,
    express: app
});

mongoose.connect(database.url);

require('./routes')(app);
require('./api')(app);
require('./passport')(passport);

var server = app.listen(3000, 'localhost', function () {
	console.log('http://%s:%s', server.address().address, server.address().port);
});

// var io = require('socket.io')(server);

// io.on('connection', function(socket){
//   console.log('a user connected');
// });


// Anonymous listening
// Register/Login system checking for @wearetwogether email

// users collection
// playlists collection
// leaderboards collection