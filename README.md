[![Build Status](https://secure.travis-ci.org/Sendanor/nor-config.png?branch=master)](http://travis-ci.org/Sendanor/nor-config)

nor-config -- Common configuration module for Sendanor's apps
=============================================================

**Warning!** This code is experimental and in a state of preliminary development. Use at your own risk.

License
-------

It's under MIT-style open source license -- see [https://github.com/Sendanor/nor-config/blob/master/LICENSE.txt](LICENSE.txt).

Installation
------------

You can install it simply from NPM:

	npm install nor-config

Usage
-----

App defaults can be configured in file `./config.json` (or later in the source code with `._def()`):

```javascript
{
  "port": 8080
}
```

Local settings (overrides values in `./config.js`) for the app can be set in `./local/config.json`:

```javascript
{
  "host": '192.168.1.1',
  "port": 3000
}
```

The `./app.js` uses it like this:

```javascript
var config = require('nor-config').from(__dirname);
config._def('host', 'localhost');
config._require('port');
console.log(config.host + ':' + config.port);
```

The output will be `192.168.1.1:3000`.

The library will also read package.json if it exists, and saves contents from it to `config.pkg`.
