var cookie = require("cookie"),
    md5 = require('MD5')
    events = require('events');

var wordpress = {
	siteurl: '',
	cookie_hash: '',
	connector: require('./lib/wp-api.js'),

	set_siteurl: function ( siteurl ) {
		this.siteurl = siteurl;
		this.cookie_hash = md5( siteurl + '/' );
		this.connector.set_siteurl( siteurl );
	},

	connect: function( cookie_data, token ) {
		var cookie_data = this.parse_cookie( cookie_data );

		if ( ! cookie_data ) {
			return false;
		}

		var wp_user = new WP_User( cookie_data.username, cookie_data.expiration );

		var success = this.connector.connect( cookie_data, token, wp_user );

		// Some magic happens here
		if( false === success ) {
			return false;
		}

		return wp_user;
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

		// 'username', 'expiration', 'token', 'hmac'
		parts = cookies[ 'wordpress_logged_in_' + this.cookie_hash ].split( '|' );

		// Quick check to see if an honest cookie has expired
		if ( parts[1] < ( Date.now() / 1000 ) ) {
			return false;
		}

		return {
			hashkey: 'wordpress_logged_in_' + this.cookie_hash,
			hash: cookies[ 'wordpress_logged_in_' + this.cookie_hash ],
			username: parts[0],
			expiration: parts[1],
			token: parts[2],
			hmac: parts[3]
		}
	},

	is_user_logged_in: function () {
		return logged_in;
	}
};


function WP_User( username, expiration ) {
	this.username    = username;
	this.expiration  = expiration;
	this.logged_in   = false;
	this.user_object = false;

	this.on('wp_connected', function ( data ) {
		this.logged_in = true;
		this.user_object = data;
	}),

	this.can = function ( capability ) {
		if ( ! this.logged_in || ! this.user_object ) {
			return false;
		}

		if ( this.user_object.capabilities[capability] !== undefined ) {
			return this.user_object.capabilities[capability];
		}

		return false;
	}
};
require('util').inherits(WP_User, events.EventEmitter);

module.exports = Object.create(wordpress);