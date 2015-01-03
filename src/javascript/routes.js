/**
 * All page routes in the site, and the methods to use them.
 */

'use strict';
var Util = require('./util');

var pages = {
    'root': {
        path: '/',
        render: function(request) {
            this.render(require('./pages/root'));
        }
    },
    'calendar': {
        path: '/Calendar/',
        render: function(request) {
            this.render(require('./pages/calendar'));
        }
    }
};


module.exports = {
    router: function() {

        var monoRouter = require('monorouter');
        var reactRouting = require('monorouter-react');

        var router = monoRouter().setup(reactRouting());

       Util.forEachMember(pages, function(pageId, page) {
            router = router.route(page.path, page.render);
        });

        return router;
    }(),

    links: function() {
        
        var links = {};

        Util.forEachMember(pages, function(pageId, page) {
            links[pageId] = function() {
                // TODO(matt) Need to parse links and get arguments
                return page.path; 
            };
        });

        return links;
    }(),
};