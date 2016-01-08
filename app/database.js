module.exports = {
	//url: 'mongodb://172.16.120.72/twogether-radio'
	url: (process.env.DATABASE || 'mongodb://localhost/twogether-radio')
}

// mongodb://admin:dJwDkWWjea@ds039125.mongolab.com:39125/community-radio-dev
// mongodb://admin:dJwDkWWjea@ds039175.mongolab.com:39175/community-radio-prod