function getCookies() {
	console.dir(cookies);
}

var Cookies = {

	getCookies: function() {

		this.cookies = {};

		for (let cookie of document.cookie.split('; ')) {
			let [name, value] = cookie.split("=");
			this.cookies[name] = decodeURIComponent(value);
		}

		return this;

	},

	set: function(name, value) {

		if(typeof value === 'object'){
			value = escape(JSON.stringify(value));
		} else if (typeof value !== 'string'){
			value = value.toString();
		} else if (!value) {
			value = "";
		} else {
			value = escape(value);
		}

		document.cookie = name + "=" + value;
		this.getCookies();

	},

	get: function(name) {
		var key, value,
			cookies = document.cookie.split(";");
		for (var i = 0; i < cookies.length; i++) {
			key = cookies[i].substr(0,cookies[i].indexOf("=")).replace(/^\s+|\s+$/gm,'');
			value = cookies[i].substr(cookies[i].indexOf("=")+1);
			if (key === name){
				return unescape(value);
			}
		}
	}

};

export default Cookies.getCookies();