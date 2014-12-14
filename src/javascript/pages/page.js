/** @jsx React.createElement */

var React = require('react');
var Util = require('../util');

module.exports = React.createClass({

    liveReloadSrc: function() {
       return 'http://localhost:35729/livereload.js?snipver=1'
    },

    render: function () {

        var liveReload = Util.isDevelopment() ?
            <script type="text/javascript" src={this.liveReloadSrc()}></script>
            : null;

        return (
            <html>
                <head>
                    <title>{this.props.title}</title>
                    <link rel="stylesheet" href="/main.css" type="text/css" />
                </head>
                <body>
                    <script type="text/javascript" src="/main.js"></script>
                    {liveReload}
                    {this.props.children}
                </body>
            </html>
        );
    },

});

