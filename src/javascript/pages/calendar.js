/**
 * @jsx React.createElement
 */

var Calendar = require('../components/calendar');

module.exports = function(props) {

    var React = require('react');
    var Page = require('./page');

    return (
        <Page title='Calendar'>
            <h1>Other page!</h1>
            <Calendar month="2014-12"/>
        </Page>
    );
};