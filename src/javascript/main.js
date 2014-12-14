/**
 * Main entry point, just starts the router
 */

var mode = '!!BUILD!!';

var Routes = require('./routes');
var Util = require('./util');

Util.config.inBrowser = true;
Util.config.isDevelopment = (mode === 'dev');

Routes
    .attach(document)
    .captureClicks();
