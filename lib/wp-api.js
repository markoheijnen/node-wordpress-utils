var http = require('http');

module.exports = {
	siteurl: '',

	set_siteurl: function ( siteurl ) {
		this.siteurl = siteurl.substr(siteurl.indexOf('://')+3);
	},

	connect: function ( cookie_data, token, wp_user ) {
		var options = {
			host: this.siteurl,
			port: 80,
			path: '/wp-json/users/me',
			headers: {
				'Cookie': cookie_data.hashkey + '=' + cookie_data.hash,
				'Content-Type': 'application/json',
				'X-WP-Nonce': token
			}
		};

		http.get(options, function(res){
			var body = '';

			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				var response = JSON.parse(body);
				wp_user.emit( 'wp_connected', response );
			});
		}).on("error", function(e){
			wp_user.emit('wp_connect_failed', e );
		});
	}
};