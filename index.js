var cookie = require("cookie"),
    md5 = require('MD5');

var wordpress = {
	siteurl: '',
	cookie_hash: '',
	connector: require('./lib/wp-api.js'),

	// Internal
	logged_in: false,
	username: false,
	expiration: false,

	set_siteurl: function ( siteurl ) {
		this.siteurl = siteurl;
		this.cookie_hash = md5( this.siteurl );
	},

	parse_cookie: function ( cookie_data ) {
		// Site url and cookie hash need to be set
		if ( ! this.siteurl || ! this.cookie_hash ) {
			return false;
		}

		var cookies = cookie.parse( cookie_data );

		// The authentication cookie isn't set
		if ( ! cookies[ 'wordpress_logged_in_' + this.cookie_hash ] ) {
			return false;
		}

		// 'username', 'expiration', 'token', 'hmac', 'scheme'
		parts = cookies[ 'wordpress_logged_in_' + this.cookie_hash ].split( '|' );

		// Quick check to see if an honest cookie has expired
		if ( parts[1] < ( Date.now() / 1000 ) ) {
			return false;
		}

		if( ! this.connector.parse_cookie( cookies ) ) {
			return false;
		}

		username   = parts[0];
		expiration = parts[1];

		return logged_in = true;

	},

	is_user_logged_in: function () {
		return logged_in;
	}
};

module.exports = Object.create(wordpress);