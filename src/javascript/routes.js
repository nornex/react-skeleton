

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
        'other': {
            path: '/Other/',
            render: function(request) {
                this.render(require('./pages/other'));
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