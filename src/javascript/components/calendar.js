/** @jsx React.createElement */

var React =     require('react');
var Style =     require('../style');
var Util =      require('../util');
var moment =    require('moment');
var Log =       Util.log;


let styles = {
    label:  Style.create({ textAlign: 'right' }).attributes,
    box:    Style.create({ width: '60px', height: '60px' }).attributes
};

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
        var dynamic = {color: this.isInDisplayedMonth() ? 'black' : '#ccc'};

        return (
            <div {...styles.box()} className="dayCell">
                <div>{this.props.children}</div>
                <div {...styles.label(dynamic)}>{this.dateText()}</div>
            </div>
        );
    }
});

var dayIndex = function(date) 
{
    return (date.day() + 6) % 7;
};

module.exports = React.createClass({

    getDefaultProps: function() {
        return {
            month: new Date(),
            monthFormat: 'MMMM YYYY'
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
        return this.month().subtract({days: dayIndex(this.month())});
    },

    /// Last day to display, if we're not ending on Sunday this will be a day in the next month
    lastDisplayDay: function()
    {
        return this.month().endOf('month').add({
            days: 6 - dayIndex(this.month().endOf('month'))
        });
    },

    render: function() {

        var rowStyle = {display: 'flex', flexDirection: 'row'};
        Log.debug(1, "Rendering calendar month: " + this.month().format());

        var headers = this.daysOfTheWeek().map(function(day){
            return <div key={day} style={{ width: '60px' }}>{day}</div>;
        });

        var rows = [];
        var currentRow = null;
        var processDay = function(currentDay) {
            if (dayIndex(currentDay) === 0)
            {
                currentRow = [];
                rows.push(currentRow);
            }

            currentRow.push(<CalendarCell month={this.month()} date={currentDay} key={currentDay.unix()}/>);
        }
        .bind(this);

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
                <div>{this.month().format(this.props.monthFormat)}</div>
                <div style={rowStyle}>{headers}</div>
                {newRows}
            </div>
        );
    }

});
