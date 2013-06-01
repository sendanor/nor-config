"use strict";

var coverage = require('./coverage.js');
var config = coverage.require('index.js');
var vows = require('vows');
var assert = require('assert');

var testdata_dir = require('path').join(__dirname, '/testdata');

/* */
vows.describe('Testing config').addBatch({
	"config": {
		topic: config,
		'is object': function(obj) { assert.isObject(obj); },
		'.from is function': function(obj) { assert.isFunction(obj.from); },
		'.tools is function': function(obj) { assert.isFunction(obj.tools); },
		'.from(testdata_dir) dost not throw Error': function(obj) {
			var c;
			assert.doesNotThrow(function () {
				c = obj.from(testdata_dir);
			}, Error);
			return c;
		},
		'.from(testdata_dir)': {
			topic: function(obj) {
				return obj.from(testdata_dir);
			},
			'is not Error': function(obj) {
				if(obj instanceof Error) {
					console.error('Got exception: ' + obj);
					if(obj.stack) {
						console.error(' at ' + obj.stack);
					}
				} 
				assert.isFalse(obj instanceof Error);
			},
			'is object': function(obj) { assert.isObject(obj); },
			'Object.keys(obj).toString()': function(obj) {
				assert.strictEqual(Object.keys(obj).toString(), 'dirs,foo,pkg,_has,_required,_def');
			},
			'.dirs is object': function(obj) { assert.isObject(obj.dirs); },
			'.dirs.root': function(obj) {
				assert.isString(obj.dirs.root);
				assert.strictEqual(obj.dirs.root, __dirname + '/testdata');
			},
			'._has is function': function(obj) { assert.isFunction(obj._has); },
			'._has is object': function(obj) { assert.isObject(obj.pkg); },
			'._required is function': function(obj) { assert.isFunction(obj._required); },
			'._def is function': function(obj) { assert.isFunction(obj._def); },
			'._has("foo")': function(obj) { 
				assert.isTrue(obj._has("foo"));
			},
			'.foo is "bar"': function(obj) { 
				assert.isString(obj.foo);
				assert.strictEqual(obj.foo, "bar");
			}
		}
	},
}).export(module);

/* EOF */
