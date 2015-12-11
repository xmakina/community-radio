module.exports = (req, res, next) => { // Bootstrap data to all views
	res.locals = {
		loggedIn: req.isAuthenticated()
	};
	if(res.locals.loggedIn) res.locals.user = req.user;
	next();
}