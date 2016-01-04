module.exports = (app, nunjucks) => {

	const env = nunjucks.configure(['./views'], {
		autoescape: true,
		express: app
	});

	// env.addFilter('test', (str, count) => {
	// 	var test = str;
	// 	return test;
	// });

}