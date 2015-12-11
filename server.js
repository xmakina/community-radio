'use strict';

const express = require('express'),
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
	.use(require('./app/bootstrap'));

mongoose.connect(database.url);

require('./app/nunjucks')(app, nunjucks);
require('./app/passport')(passport);
require('./app/sockets')(io);
require('./app/routes')(app);
require('./app/api')(app);

const server = http.listen(3000, 'localhost', () => {
	console.log('http://%s:%s', server.address().address, server.address().port);
});