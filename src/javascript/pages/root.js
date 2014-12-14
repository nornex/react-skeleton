/**
 * @jsx React.createElement
 */

module.exports = function(props) {
    'use strict';

    var React = require('react');
    var Page = require('./page');

    return (
        <Page title='Root page'>
            <div>Hello world<b>a</b>!</div>
            <a href="/Other/">Other page</a>
        </Page>
    );
};