module.exports = {
	siteurl: '',

	set_siteurl: function ( siteurl ) {
		this.siteurl = siteurl.substr(siteurl.indexOf('://')+3);
	},

	connect: function ( cookie_data, token ) {
		return true;
	}
};