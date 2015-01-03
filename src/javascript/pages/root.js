/**
 * @jsx React.createElement
 */

 var links = require('../routes').links;

module.exports = function(props) {
    'use strict';

    var React = require('react');
    var Page = require('./page');

    return (
        <Page title='Front page'>
            <div>Hello <b>world</b>!</div>
            <a href={links.calendar()}>Other page</a>
        </Page>
    );
};