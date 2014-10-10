/* global StackFrame: false */
(function (root, factory) {
    'use strict';
    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.
    if (typeof define === 'function' && define.amd) {
        define(['stackframe'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('stackframe'));
    } else {
        root.ErrorStackParser = factory(root.StackFrame);
    }
}(this, function () {
    'use strict';
    return function ErrorStackParser() {
        this.firefoxSafariStackEntryRegExp = /\S+\:\d+/;
        this.chromeIEStackEntryRegExp = /\s+at /;

        /**
         * Given an Error object, extract the most information from it.
         * @param error {Error}
         * @return Array[StackFrame]
         */
        this.parse = function parse(error) {
            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                return this.parseOpera(error);
            } else if (error.stack.match(this.chromeIEStackEntryRegExp)) {
                return this.parseV8OrIE(error);
            } else if (error.stack.match(this.firefoxSafariStackEntryRegExp)) {
                return this.parseFFOrSafari(error);
            } else {
                throw new Error('Cannot parse given Error object');
            }
        };

        /**
         * Separate line and column numbers from a URL-like string.
         * @param urlLike String
         * @return Array[String]
         */
        this.extractLocation = function extractLocation(urlLike) {
            var locationParts = urlLike.split(':');
            var lastNumber = locationParts.pop();
            var possibleNumber = locationParts[locationParts.length - 1];
            if (!isNaN(parseFloat(possibleNumber)) && isFinite(possibleNumber)) {
                var lineNumber = locationParts.pop();
                return [locationParts.join(':'), lineNumber, lastNumber];
            } else {
                return [locationParts.join(':'), lastNumber, undefined];
            }
        };

        this.parseV8OrIE = function parseV8OrIE(error) {
            return error.stack.split('\n').splice(1).map(function (line) {
                var tokens = line.split(/\s+/).splice(2);
                var locationParts = this.extractLocation(tokens.pop().replace(/[\(\)\s]/g, ''));
                var functionName = (!tokens[0] || tokens[0] === 'Anonymous') ? undefined : tokens[0];
                return new StackFrame(functionName, undefined, locationParts[0], locationParts[1], locationParts[2]);
            }.bind(this));
        };

        this.parseFFOrSafari = function parseFFOrSafari(error) {
            return error.stack.split('\n').filter(function (line) {
                return !!line.match(this.firefoxSafariStackEntryRegExp);
            }.bind(this)).map(function (line) {
                var tokens = line.split('@');
                var locationParts = this.extractLocation(tokens.pop());
                var functionName = tokens.shift() || undefined;
                return new StackFrame(functionName, undefined, locationParts[0], locationParts[1], locationParts[2]);
            }.bind(this));
        };

        this.parseOpera = function parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                    e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                return this.parseOpera9(e);
            } else if (!e.stack) {
                return this.parseOpera10a(e);
            } else if (e.stacktrace.indexOf("called from line") < 0) {
                return this.parseOpera10b(e);
            } else {
                return this.parseOpera11(e);
            }
        };

        this.parseOpera9 = function parseOpera9(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame(undefined, undefined, match[2], match[1]));
                }
            }

            return result;
        };

        this.parseOpera10a = function parseOpera10a(e) {
            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n');
            var result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame(match[3], undefined, match[2], match[1]));
                }
            }

            return result;
        };

        // Opera 10.65+ Error.stack very similar to FF/Safari
        this.parseOpera11 = function parseOpera11(error) {
            return error.stack.split('\n').filter(function (line) {
                return !!line.match(this.firefoxSafariStackEntryRegExp);
            }.bind(this)).map(function (line) {
                var tokens = line.split('@');
                var location = tokens.pop().split(':');
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall.replace(/<anonymous function: (\w+)>/, '$1').replace(/\([^\)]*\)/, '') || undefined;
                var argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1') || undefined;
                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ? undefined : argsRaw.split(',');
                return new StackFrame(functionName, args, location[0] + ':' + location[1], location[2], location[3]);
            });
        };
    };
}));

