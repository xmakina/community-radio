const resources = require('./resources');

module.exports = () => {

	const env = resources.nunjucks.configure(['./views'], {
		autoescape: true,
		express: resources.app
	});

	// env.addFilter('test', (str, count) => {
	// 	var test = str;
	// 	return test;
	// });

}