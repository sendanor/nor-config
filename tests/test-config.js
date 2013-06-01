"use strict";

var coverage = require('./coverage.js');
var config = coverage.require('index.js');
var vows = require('vows');
var assert = require('assert');

/* */
vows.describe('Testing config').addBatch({
	"config": {
		topic: config,
		'is object': function(obj) { assert.isObject(obj); },
		'.from is function': function(obj) { assert.isFunction(obj.from); },
		'.tools is function': function(obj) { assert.isFunction(obj.tools); }
	},
}).export(module);

/* EOF */
