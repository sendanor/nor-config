/* index.js */
var fs = require('fs');
var path = require('path');

/** ConfigObj */
function ConfigObj(config) {
	this.config = config;
}

/* config.has(key) is silent test for configuration setting */
ConfigObj.prototype.has = function(key) {
	var config = this.config;
	return (config[key] === undefined) ? false : true;
};

/* config.require(key) is verbose test for configuration setting */
ConfigObj.prototype.required = function(key) {
	var config = this.config;
	if(config[key] === undefined) {
		console.error('Error: Missing required configuration setting '+key+'!');
		return false;
	}
	return true;
};

/* config.def(key, value) sets default values */
ConfigObj.prototype.def = function(key, value) {
	var config = this.config;
	if(config[key] === undefined) {
		config[key] = value;
	}
};

/* */
var mod = module.exports = {};

/* Config from srcdir */
mod.from = function(srcdir) {

	/* Append config file into config object */
	function file2obj(file) {
		if(!fs.existsSync(file)) {
			return {};
		}
		var buffer = JSON.parse(fs.readFileSync(file), {'encoding':'utf8'});
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
		if(! (obj && (typeof obj === 'object')) ) {
			 throw new TypeError("Attempt to append non-object (" + (typeof obj) + ")!");
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
				console.log("new_value", new_value);
				config[key] = append_to(config[key], new_value).config;
				return;
			}

			// Other
			config[key] = new_value;
		});
		return {"and": append_to.bind({}, config), "config":config};
	}

	var basedir = path.dirname(srcdir);
	var config_fn = path.join(basedir, 'config.js');

	var config = {
		'dirs': {
			'src': srcdir,
			'root': basedir
		}
	};

	var pkg_file = path.join(basedir, 'package.json');
	var pkg_config = file2obj(pkg_file);

	var default_file = path.join(basedir, 'config.json');
	var default_config = file2obj(default_file);

	var local_file = path.join(basedir, 'local', 'config.json');
	var local_config = file2obj(local_file);

	//console.log(__filename + ": DEBUG: def", default_config, " from ", default_file);
	//console.log(__filename + ": DEBUG: local", local_config, " from ", local_file);

	var config = append_to(config, default_config).and(local_config).config;
	config.pkg = pkg_config;
	var tools = new ConfigObj(config);
	config._has = tools.has.bind(tools);
	config._required = tools.required.bind(tools);
	config._def = tools.def.bind(tools);
	return config;
};

mod.tools = function(obj) {
	return new ConfigObj(obj);
};

/* EOF */
