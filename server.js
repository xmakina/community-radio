'use strict';

const express = require('express'),
	nunjucks = require('nunjucks'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	flash = require('express-flash'),
	session = require("express-session"),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	database = require('./app/database'),
	app = express(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	MongoStore = require('connect-mongo')(session);

app
	.use(express.static(__dirname + '/assets'))
	.use(session({
		store: new MongoStore({
			mongooseConnection: mongoose.connection
		}),
		secret: "itsAMassiveSecret",
		resave: false,
		saveUninitialized: true
	}))
	.use(cookieParser())
	.use(bodyParser.urlencoded({ extended: false }))
	.use(bodyParser.json())
	.use(passport.initialize())
	.use(passport.session())
	.use(flash())
	.use(require('./app/bootstrap'));

require('./app/nunjucks')(app, nunjucks);
require('./app/passport')(passport);
require('./app/sockets')(io, app);
require('./app/routes')(app);
require('./app/api')(app);

mongoose.connect(database.url);

const server = http.listen(3000, () => {
	console.log('http://%s:%s', server.address().address, server.address().port);
});