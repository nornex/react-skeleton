/**
 * @jsx React.createElement
 */

var Calendar = require('../components/calendar');
var moment = require('moment');

module.exports = function(props) {

    var React = require('react');
    var Page = require('./page');

    return (
        <Page title='Calendar'>
            <h1>Other page!</h1>
            <Calendar />
            <a href="/">Main page</a>
        </Page>
    );
};