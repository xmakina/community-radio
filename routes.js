var nunjucks = require('nunjucks');

module.exports = function(app){

	app.get('/', function (req, res) {
		res.render('login.html', {title: 'twogether radio'});
	});

	app.post('/', function (req, res) {
		res.send('Got a POST request');
	});

	app.put('/user', function (req, res) {
		res.send('Got a PUT request at /user');
	});

	app.delete('/user', function (req, res) {
		res.send('Got a DELETE request at /user');
	});

};