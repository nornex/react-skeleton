/**
 * @jsx React.createElement
 */

module.exports = function(props) {
    'use strict';

    var React = require('react');
    var Page = require('./page');

    return (
        <Page title='Root page'>
            <div>Hello <b>world</b>!</div>
            <a href="/Calendar/">Other page</a>
        </Page>
    );
};