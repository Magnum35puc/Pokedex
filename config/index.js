'use strict';

if(process.env.NODE_ENV === 'production') {
	module.exports = {
	FB: {
		pageAccessToken : process.env.pageAccessToken,
		VerifyToken : process.env.VerifyToken,
		AppSecret : process.env.AppSecret
	}
	}
}
else {
	module.exports = require('./development.json');
}