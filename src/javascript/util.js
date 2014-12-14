/**
 *
 */

exports.config = {
    inBrowser: null,
    isDevelopment: null
};

exports.isBrowser = function () {
    if (this.config.inBrowser === null)
    {
        throw "No inBrowser defined, should be set by app.";
    }

    return this.config.inBrowser;
};

exports.isServer = function () {
    if (this.config.inBrowser === null)
    {
        throw "No inBrowser defined, should be set by app.";
    }

    return !this.config.inBrowser;
};

exports.isDevelopment = function () {
    if (this.config.isDevelopment === null)
    {
        throw "No isDevelopment defined, should be set by app.";
    }

    return this.config.isDevelopment;
};

exports.isProduction = function () {
    if (this.config.isDevelopment === null)
    {
        throw "No isDevelopment defined, should be set by app.";
    }

    return !this.config.isDevelopment;
};