/**
 * @param mode Either 'dev' or 'prod'
 */


module.exports = function(mode)
{   'use strict';

    var Util = require('../javascript/util');
    Util.config.inBrowser = false;
    Util.config.isDevelopment = (mode === 'dev');

    var Express = require('express');
    var Routes = require('../javascript/routes');
    var Path = require('path');
    var MonorouterExpress = require('connect-monorouter');

    var options = {
        root: Path.normalize(__dirname + '/../client'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };

    var app = Express()
        .use(MonorouterExpress(Routes))
        .get('/main.js', function(req, res) {
            res.sendFile('/main.js', options);
        })
        .get('/main.css', function(req, res) {
            res.sendFile('/main.css', options);
        });

    return app;
}

