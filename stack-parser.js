// TODO: AMD/CommonJS/etc wrapper
(function stackParser() {
    function StackFrame(functionName, args, srcUrl, lineNumber, columnNumber) {
        this.fn = functionName;
        this.args = args;
        this.src = srcUrl;
        this.line = lineNumber;
        this.column = columnNumber;
    }

    function StackParser() {
        this.firefoxSafariStackEntryRegExp = /\S+\:\d+/;
        this.chromeIEStackEntryRegExp = /\s+at /;

        /**
         * Given an Error object, extract the most information from it.
         * @param error {Error}
         * @return Array[StackFrame]
         */
        this.parse = function parse(error) {
            if (typeof error.stacktrace === 'string') {
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
            /* stack: "TypeError: Object #<Object> has no method 'undef'\n" +
             "    at Object.bar (http://path/to/stacktrace.js:42:18)\n" +
             "    at foo (http://path/to/file.js:20:5)\n" +
             "    at http://path/to/file.js:24:4"*/

            return error.stack.split('\n').splice(1).map(function(line) {
                var tokens = line.split(/\s+/).splice(2);
                var location = tokens.pop().replace(/[\(\)\s]/g, '').split(':');
                var functionName = (!tokens[0] || tokens[0] === 'Anonymous') ? '' : tokens[0];
                return new StackFrame(functionName, [], location[0] + ':' + location[1], location[2], location[3]);
            });
        };

        this.parseFFOrSafari = function parseFFOrSafari(error) {
            /* stack: "@http://path/to/file.js:48\n" +
             "bar@http://path/to/file.js:52\n" +
             "foo@http://path/to/file.js:82\n" +
             "[native code]" */

            return error.stack.split('\n').filter(function(line) {
                return !!line.match(this.firefoxSafariStackEntryRegExp);
            }.bind(this)).map(function(line) {
                var tokens = line.split('@');
                var location = tokens.pop().split(':');
                var functionName = tokens.shift() || '';
                return new StackFrame(functionName, [], location[0] + ':' + location[1], location[2], location[3]);
            });
        };

        this.parseOpera = function parseOpera(e) {
            if (!e.stacktrace || (e.message.indexOf('\n') > -1
                    && e.message.split('\n').length > e.stacktrace.split('\n').length)) {
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
            // "  Line 43 of linked script http://path/to.js\n"
            // "  Line 7 of inline#1 script in http://path/to.js\n"
            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
            var lines = e.message.split('\n');
            var result = [];

            for (var i = 2, len = lines.length; i < len; i += 2) {
                var match = lineRE.exec(lines[i]);
                if (match) {
                    result.push(new StackFrame('', [], match[2], match[1]));
                }
            }

            return result;
        };

        this.parseOpera10a = function parseOpera10a(e) {
            // "  Line 27 of linked script http://path/to.js\n"
            // "  Line 11 of inline#1 script in http://path/to.js: In function foo\n"
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
            return error.stack.split('\n').filter(function(line) {
                return !!line.match(this.firefoxSafariStackEntryRegExp);
            }.bind(this)).map(function(line) {
                var tokens = line.split('@');
                var location = tokens.pop().split(':');
                var functionCall = (tokens.shift() || '');
                var functionName = functionCall.replace(/<anonymous function: (\S+)(\([^\(]*\))?>/, '$1');
                var args = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1').replace('arguments not available', '').split(',');
                return new StackFrame(functionName, args, location[0] + ':' + location[1], location[2], location[3]);
            });
        }
    }

//    Error.prototype.parseError = function parseError(e) {};

    window.StackFrame = StackFrame;
    window.StackParser = StackParser;
})();
