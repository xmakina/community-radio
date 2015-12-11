module.exports = (app, nunjucks) => {

	nunjucks.configure(['./views'], {
		autoescape: true,
	    express: app
	});

	const env = new nunjucks.Environment();

	env.addFilter('dump', (str, count) => {
		return JSON.stringify(str, null, "\t");
	});

}