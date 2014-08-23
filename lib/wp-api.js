var http = require('http');

module.exports = {
	siteurl: '',

	set_siteurl: function ( siteurl ) {
		this.siteurl = siteurl.substr(siteurl.indexOf('://')+3);
	},

	connect: function ( cookie_data, token ) {
		console.log( cookie_data.hashkey + '=' + cookie_data.hash );

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

		http.get(options, function(resp){
			resp.on('data', function(chunk){
				console.log("Finished: " + chunk);
			});
		}).on("error", function(e){
			console.log("Got error: " + e.message);

			
		});
	}
};