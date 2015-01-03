'use strict';

var React = require('react');
var ReactCss = require('react/lib/CSSPropertyOperations');
var Util = require('./util');

var generateClassName = function() {

    var nextClassNum = 0;
    var classFirstChars = [
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
        'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
    ];
    var otherChars = classFirstChars.concat([
        '0','1','2','3','4','5','6','7','8','9'
    ]);

    return function() 
    {
        var remaining = nextClassNum++;
        var className = classFirstChars[remaining % classFirstChars.length];
        remaining = Math.floor(remaining/classFirstChars.length);

        while (remaining > 0.1)
        {
            className = otherChars[remaining % otherChars.length];
            remaining = Math.floor(remaining/otherChars.length);
        }

        return className;
    };
}();

var styleClasses = {};
var classesReverseLookup = {};

var styleElementExported = false;

exports.css = function() 
{
    styleElementExported = true;

    var classes = [];
    Util.forEachMember(styleClasses, function(name, style) {
        classes.push('.' + name + ':{' + style + '}');
    });
    return classes.join(' ');
};

exports.styleElement = function()
{
    styleElementExported = true;

    return React.createElement('style', {
        dangerouslySetInnerHTML: {'__html': this.css()}
    });
};

exports.create = function()
{
    var attributesAppender = function(existing, toAdd)
    {
        if (toAdd === undefined)
        {
            return existing;
        }

        var newAttributes = {};
        Util.forEachMember(existing, function(name, value) {
            if (name === 'style')
            {
                var newStyle = {};
                Util.forEachMember(value, function(cssName, cssValue) {
                    if (toAdd.hasOwnProperty(cssName))
                    {
                        newStyle[cssName] = toAdd[cssName];
                    }
                    else
                    {
                        newStyle[cssName] = cssValue;
                    }
                });
                Util.forEachMember(toAdd, function(cssName, cssValue) {
                    newStyle[cssName] = cssValue;
                });

                newAttributes[name] = newStyle;
            }
            else
            {
                newAttributes[name] = value;
            }
        });

        if (!existing.hasOwnProperty('style'))
        {
            newAttributes.style = {};
            Util.forEachMember(toAdd, function(cssName, cssValue) {
                newAttributes.style[cssName] = cssValue;
            });
        }

        return newAttributes;
    };

    return  function(name, style)
    {
        if (styleElementExported)
        {
            return { 
                'name': function() { return name; },
                'attributes': function(attr) { 
                    return attributesAppender({'style': style}, attr); 
                } 
            };
        }

        if (style === undefined)
        {
            style = name;
            name = null;
        }

        var css = ReactCSS.createMarkupForStyles(style);
        var existingName = classesReverseLookup[css];

        if (existingName)
        {
            name = existingName;
        }
        else
        {
            name = name || generateClassName();
            classesReverseLookup[css] = name;
            styleClasses[name] = css;
        }

        Util.log.info("Class: " + name);
        
        return { 
            'name': function() { return name; },
            'attributes': function(attr) { 
                return attributesAppender({ 'className': name }, attr); 
            }
        };
    };
}();
