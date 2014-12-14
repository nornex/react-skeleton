/**
 * @jsx React.createElement
 */

module.exports = function(props) {
    'use strict';

    var React = require('react');
    var Page = require('./page');

    return (
        <Page title='Other page'>
            <div>Other page!</div>
            <a href="/">Main page</a>
        </Page>
    );
};