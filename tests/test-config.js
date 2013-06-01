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
				assert.strictEqual(Object.keys(obj).toString(), 'dirs,foo,colors,flags,pkg,_has,_require,_def');
			},
			'.dirs is object': function(obj) { assert.isObject(obj.dirs); },
			'.dirs.root': function(obj) {
				assert.isString(obj.dirs.root);
				assert.strictEqual(obj.dirs.root, __dirname + '/testdata');
			},
			'._has is function': function(obj) { assert.isFunction(obj._has); },
			'._has is object': function(obj) { assert.isObject(obj.pkg); },
			'._require is function': function(obj) { assert.isFunction(obj._require); },
			'._def is function': function(obj) { assert.isFunction(obj._def); },
			'._has("foo")': function(obj) {
				assert.isTrue(obj._has("foo"));
			},
			'._has("bar")': function(obj) {
				assert.isFalse(obj._has("bar"));
			},
			'._require("foo")': function(obj) {
				assert.isTrue(obj._require("foo"));
			},
			'._require("bar") throws ReferenceError': function(obj) {
				assert.throws(function() {
					obj._require("bar");
				}, ReferenceError);
			},
			'._def("hello", "world")': {
				topic: function(obj) {
					return obj._def("hello", "world");
				},
				'._has("hello")': function(obj) {
					assert.isFalse(obj._has("bar"));
				},
				'.hello is "world"': function(obj) { 
					assert.isString(obj.hello);
					assert.strictEqual(obj.hello, "world");
				}
			},
			'.foo is "bar"': function(obj) { 
				assert.isString(obj.foo);
				assert.strictEqual(obj.foo, "bar");
			},
			'.colors is ["orange", "blue", "black"]': function(obj) { 
				assert.isArray(obj.colors);
				assert.deepEqual(obj.colors, ["orange", "blue", "black"]);
			},
			'.flags is {"en":"en.png","fi":"fi.png"}': function(obj) { 
				assert.isObject(obj.flags);
				assert.strictEqual(JSON.stringify(obj.flags), '{"en":"en.png","fi":"fi.png"}');
			}
		}
	},
}).export(module);

/* EOF */
