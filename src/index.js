/* index.js */
var fs = require('fs');
var path = require('path');

/** ConfigObj */
function ConfigObj(config) {
	this.config = config;
}

/** config.has(key) is silent test for configuration setting */
ConfigObj.prototype.has = function(key) {
	var config = this.config;
	return (config[key] === undefined) ? false : true;
};

/** config.require(key) is verbose test for configuration setting */
ConfigObj.prototype.require = function(key) {
	var config = this.config;
	if(config[key] === undefined) {
		throw new ReferenceError('Missing required setting: '+key);
	}
	return true;
};

/** config.def(key, value) sets default values */
ConfigObj.prototype.def = function(key, value) {
	var config = this.config;
	if(config[key] === undefined) {
		config[key] = value;
	}
	return this;
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
		try {
			var buffer = JSON.parse(fs.readFileSync(file), {'encoding':'utf8'});
			if(!(buffer && (typeof buffer === 'object'))) {
				throw new TypeError('Failed to parse file as an object: ' + file);
			}
			return buffer;
		} catch(e) {
			console.warn("Warning! Failed to read file " + file + ": " + e);
			return {};
		}
	}

	/* Append config file into config object */
	function append_to(config, obj) {
		if(config === undefined) {
			console.warn('Warning: config internal append_to() called with undefined first argument!');
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
				} else if(config[key] === undefined) {
					config[key] = [].concat(new_value);
				} else {
					throw new TypeError("Attempt to append an array into " + (typeof config[key]) + "!");
				}
				return;
			}

			// Objects
			if(new_value && (typeof new_value === 'object')) {
				//console.log("new_value", new_value);
				config[key] = append_to(config[key], new_value).config;
				return;
			}

			// Other
			config[key] = new_value;
		});
		return {"and": append_to.bind({}, config), "config":config};
	}

	var basedir = srcdir;
	var config_fn = path.join(basedir, 'config.js');

	var config = {
		'dirs': {
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

	var c = append_to(config, default_config).and(local_config).config;
	c.pkg = pkg_config;
	var tools = new ConfigObj(c);
	c._has = tools.has.bind(tools);
	c._require = tools.require.bind(tools);
	c._def = function(key, value) {
		tools.def(key, value);
		return c;
	};
	return c;
};

mod.tools = function(obj) {
	return new ConfigObj(obj);
};

/* EOF */
