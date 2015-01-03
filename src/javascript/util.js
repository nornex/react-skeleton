/**
 * General core utilities.
 */

exports.config = {
    inBrowser: null,
    isDevelopment: null,
    logging: {
        level: 0
    }
};

exports.isBrowser = function () {
    if (this.config.inBrowser === null)
    {
        throw "No inBrowser defined, should be set by app.";
    }

    return this.config.inBrowser;
};

exports.isServer = function () {
    return !this.isBrowser();
};

exports.isDevelopment = function () {
    if (this.config.isDevelopment === null)
    {
        throw "No isDevelopment defined, should be set by app.";
    }

    return this.config.isDevelopment;
};

exports.isProduction = function () {
    return !this.isDevelopment();
};

exports.forEachMember = function (obj, callback) {

    let innerLoop = function (item, i) {
        callback(item, obj[item], i);
    };

    let i = 0;
    for (var item in obj)
    {
        if(obj.hasOwnProperty(item)) {
            innerLoop(item, i++);
        }
    }
};

exports.log = {
    LogLevel: {
        Info:       0,
        Warn:       1,
        Error:      2,
        Fatal:      3
    },

    write: function(level, toLog) {
        if (this.isProduction)
        {
            return;
        }

        if (exports.config.logging.level <= level)
        {
            console.log(toLog);
        }
    },

    info:  function (toLog) { this.write(this.LogLevel.Info, toLog); },
    warn:  function (toLog) { this.write(this.LogLevel.Warn, toLog); },
    error: function (toLog) { this.write(this.LogLevel.Error, toLog); },
    fatal: function (toLog) { this.write(this.LogLevel.Fatal, toLog); },
    debug: function (level, toLog) { this.write(-level, toLog); }
};



