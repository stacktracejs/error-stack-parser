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

        this.parseV8OrIE = function parseV8OrIE(error) {
            return error.stack.split('\n').splice(1).map(function (line) {
                var tokens = line.split(/\s+/).splice(2);
                var location = tokens.pop().replace(/[\(\)\s]/g, '').split(':');
                var functionName = (!tokens[0] || tokens[0] === 'Anonymous') ? undefined : tokens[0];
                return new StackFrame(functionName, undefined, location[0] + ':' + location[1], location[2], location[3]);
            });
        };

        this.parseFFOrSafari = function parseFFOrSafari(error) {
            return error.stack.split('\n').filter(function (line) {
                return !!line.match(this.firefoxSafariStackEntryRegExp);
            }.bind(this)).map(function (line) {
                var tokens = line.split('@');
                var location = tokens.pop().split(':');
                var functionName = tokens.shift() || undefined;
                return new StackFrame(functionName, undefined, location[0] + ':' + location[1], location[2], location[3]);
            });
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
            var ANON = '{anonymous}', lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
            var lines = e.stacktrace.split('\n'), result = [];

            for (var i = 0, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    var fnName = match[3] || ANON;
                    result.push(fnName + '()@' + match[2] + ':' + match[1] + ' -- ' + lines[i + 1].replace(/^\s+/, ''));
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

