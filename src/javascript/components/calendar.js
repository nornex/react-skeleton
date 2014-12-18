/** @jsx React.createElement */

var React =     require('react');
var Util =      require('../util');
var moment =    require('moment');

var CalendarCell = React.createClass({

    getDefaultProps: function()
    {
        return { format: "Do" };
    },

    dateText: function() {
        return this.props.date.format(this.props.format);
    },

    /// Is this day in the month we're displaying, or one of the extras either side.
    isInDisplayedMonth: function()
    {
        return (this.props.month.isSame(this.props.date.clone().startOf('month')));
    },

    render: function()
    {
        var boxStyle = {
            width: '60px', height: '60px',
            color: this.isInDisplayedMonth() ? 'black' : '#ccc'
        };


        var contentStyle = {

        };

        var labelStyle = {
            textAlign: 'right'
        };

        return (
            <div style={boxStyle} className="dayCell">
                <div style={contentStyle}>{this.props.children}</div>
                <div style={labelStyle}>{this.dateText()}</div>
            </div>
        );
    }
});

module.exports = React.createClass({

    getDefaultProps: function() {
        return {
            month: new Date()
        };
    },

    month: function() { return moment(this.props.month).startOf('month'); },

    daysOfTheWeek: function()
    {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    },

    /// First day to display, if we're not starting on Monday this will be a day in the previous month
    firstDisplayDay: function()
    {
        return this.month().subtract({days: this.month().weekday()});
    },

    /// Last day to display, if we're not ending on Sunday this will be a day in the next month
    lastDisplayDay: function()
    {
        return this.month().endOf('month').add({
            days: 6 - this.month().endOf('month').weekday()
        });
    },

    render: function() {

        var rowStyle = {display: 'flex', flexDirection: 'row'};

        var headers = this.daysOfTheWeek().map(function(day){
            return <div key={day} style={{ width: '60px' }}>{day}</div>;
        });

        var rows = [];
        var currentRow = null;
        var processDay = function(currentDay) {
            if (currentDay.weekday() === 0)
            {
                currentRow = [];
                rows.push(currentRow);
            }

            currentRow.push(<CalendarCell month={this.month()} date={currentDay} key={currentDay.unix()}/>);
        }.bind(this);

        var before = this.lastDisplayDay();
        for (var currentDay = this.firstDisplayDay(); currentDay.isBefore(before); currentDay.add({days: 1}))
        {
            processDay(currentDay.clone());
        }

        var newRows = rows.map(function (row, i) {
            return <div className="calendarRow" style={rowStyle} key={i}>{row}</div>;
        });

        return (
            <div className="calendar">
                <div style={rowStyle}>{headers}</div>
                {newRows}
            </div>
        );
    }

});
