

module.exports = function() {
    'use strict';

    var monoRouter = require('monorouter');
    var reactRouting = require('monorouter-react');

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

    var router = monoRouter().setup(reactRouting());

    for (var pageId in pages) {
        if(pages.hasOwnProperty(pageId)) {
            var page = pages[pageId];
            router = router.route(page.path, page.render);
        }
    }

    return router;
}();