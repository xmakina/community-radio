var express = require('express'),
	nunjucks = require('nunjucks');
	app = express();

nunjucks.configure(['./views'], {
	autoescape: true,
    express: app
});

app.use(express.static(__dirname + '/assets'));

require('./routes')(app);

var server = app.listen(3000, function () {
	console.log('http://%s:%s', server.address().address, server.address().port);
});