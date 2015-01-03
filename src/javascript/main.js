/**
 * Main entry point, just starts the router
 */

var mode = '!!BUILD!!';

var Router = require('./routes').router;
var Util = require('./util');

Util.config.inBrowser = true;
Util.config.isDevelopment = (mode === 'dev');

Router
    .attach(document)
    .captureClicks();
