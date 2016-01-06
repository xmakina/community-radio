'use strict';

const express = require('express'),
	nunjucks = require('nunjucks'),
	mongoose = require('mongoose'),
	redis = require("redis"),
	passport = require('passport'),
	cookieSession = require('cookie-session'),
	flash = require('express-flash'),
	session = require("express-session"),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	database = require('./app/database'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	redisClient = redis.createClient(),
	redisStore = require("connect-redis")(session);

app
	.use(express.static(__dirname + '/assets'))
	.use(cookieSession({
		name: 'session',
		secret: 'itsAMassiveSecret'
	}))
	.use(session({
		store: new redisStore({
			client: redisClient
		}),
		resave: true, 
		saveUninitialized: true,
		secret: "itsAMassiveSecret",
	}))
	.use(cookieParser("itsAMassiveSecret"))
	.use(bodyParser.urlencoded({ extended: false }))
	.use(bodyParser.json())
	.use(passport.initialize())
	.use(passport.session())
	.use(flash())
	.use(require('./app/bootstrap'));

require('./app/nunjucks')(app, nunjucks);
require('./app/passport')(passport);
require('./app/sockets')(io, app, redisClient);
require('./app/routes')(app);
require('./app/api')(app);

mongoose.connect(database.url);

const server = http.listen(3000, 'localhost', () => {
	console.log('http://%s:%s', server.address().address, server.address().port);
});