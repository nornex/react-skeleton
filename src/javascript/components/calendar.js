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
        return (this.props.month.isSame(this.props.date.month()));
    },

    render: function()
    {
        var boxStyle = {
            width: '100px', height: '100px'
        };

        var contentStyle = {

        };

        var labelStyle = {
            'text-align': 'right'
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

    daysOfTheWeek: function()
    {
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    },

    /// First day to display, if we're not starting on Monday this will be a day in the previous month
    firstDisplayDay: function()
    {
        return this.props.month.subtract({days: this.props.month.weekday()});
    },

    /// Last day to display, if we're not ending on Sunday this will be a day in the next month
    lastDisplayDay: function()
    {
        return this.props.month.add({
            days: 6 - this.props.month.endOf('month').weekday()
        });
    },

    render: function() {

        var month = this.props.month;

        var headers = this.daysOfTheWeek().map(function(day){
            return <span key={day}>{day}</span>;
        });

        var rows = [];
        var currentRow = null;
        var before = this.lastDisplayDay().add({days: 1});

        console.log("Month:");
        console.log( moment().startOf('month').format());

        for (var currentDay = this.firstDisplayDay(); currentDay.isBefore(before); currentDay.add({days: 1}))
        {
            if (currentDay.weekday() === 0)
            {
                currentRow = [];
                rows.append(currentRow);
            }

            currentRow.append(<CalendarCell month={this.props.month} date={currentDay} key={currentDay.unix()}/>);
        }

        var newRows = rows.map(function (row) {
            return <div className="calendarRow">{row}</div>;
        });

        return (
            <div className="calendar">
                <div>{headers}</div>
                {newRows}
            </div>
        );
    }

});
