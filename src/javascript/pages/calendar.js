/**
 * @jsx React.createElement
 */

var Calendar = require('../components/calendar');
var links = require('../routes').links;
var moment = require('moment');

module.exports = function(props) {

    var React = require('react');
    var Page = require('./page');

    return (
        <Page title='Calendar'>
            <h1>Calendar page!</h1>
            <Calendar month='2014-10-01' />
            <a href={links.root()}>Main page</a>
        </Page>
    );
};