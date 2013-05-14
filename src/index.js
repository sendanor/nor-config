/* index.js */
var fs = require('fs');
var path = require('path');

/* */
module.exports = function(srcdir) {

	/* Append config file into config object */
	function file2obj(file) {
		if(!fs.existsSync(file)) {
			return {};
		}
		var buffer = JSON.parse(fs.readFileSync(file));
		if(!(buffer && (typeof buffer === 'object'))) {
			throw new TypeError('Failed to parse file as an object: ' + file);
		}
		return buffer;
	}

	/* Append config file into config object */
	function append_to(config, obj) {
		if(config === undefined) {
			config = {};
		} else if(! (config && (typeof config === 'object')) ) {
			throw new TypeError("Attempt to append an object into " + (typeof config) + "!");
		}
		Object.keys(obj).forEach(function(key) {
			var new_value = obj[key];

			// Arrays
			if(new_value && (new_value instanceof Array)) {
				if(config[key] && (config[key] instanceof Array)) {
					config[key] = config[key].concat(new_value);
				} else {
					throw new TypeError("Attempt to append an object into " + (typeof config[key]) + "!");
				}
				return;
			}

			// Objects
			if(new_value && (typeof new_value === 'object')) {
				config[key] = append_to(config[key], new_value).config;
				return;
			}

			// Other
			config[key] = new_value;
		});
		return {"and": append_to.bind(config), "config":config};
	}

	var basedir = path.dirname(srcdir);
	var config_fn = path.join(basedir, 'config.js');

	var config = {
		'dirs': {
			'src': srcdir,
			'root': basedir
		}
	};

	return append_to(config, file2obj(path.join(basedir, 'config.js'))).and(file2obj(path.join(basedir, 'local', 'config.js'))).config;
};

/* EOF */
