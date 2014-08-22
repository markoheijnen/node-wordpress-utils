var cookie = require("cookie"),
    md5 = require('MD5');

var wordpress = {
	siteurl: '',
	cookie_hash: '',
	logged_in: false,

	set_siteurl: function ( siteurl ) {
		this.siteurl = siteurl;
		this.cookie_hash = md5( this.siteurl );
	},

	parse_cookie: function ( cookie_data ) {
		if ( ! this.siteurl ) {
			return false;
		}

		var cookies = cookie.parse( cookie_data );

		if ( ! cookies[ 'wordpress_logged_in_' + this.cookie_hash ] ) {
			return false;
		}

		// 'username', 'expiration', 'token', 'hmac', 'scheme'
		parts = cookies[ 'wordpress_logged_in_' + this.cookie_hash ].split( '|' );

		if ( parts[1] < ( Date.now() / 1000 ) ) {
			return false;
		}

	},

	is_user_logged_in: function () {
		return logged_in;
	}
};

module.exports = Object.create(wordpress);