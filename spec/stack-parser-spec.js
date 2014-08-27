/* global StackFrame: false, StackParser: false, CapturedExceptions: false */

describe('error-parser.js', function() {
    describe('StackParser', function() {
        describe('#parse', function() {
            var unit = new StackParser();
            it('should parse Safari 6 Error.stack', function() {
                var stackFrames = unit.parse(CapturedExceptions.SAFARI_6);
                expect(stackFrames).toBeTruthy();
                expect(stackFrames.length).toBe(3);
                expect(stackFrames[0]).toEqual(new StackFrame('', [], 'http://path/to/file.js', '48'));
                expect(stackFrames[1]).toEqual(new StackFrame('dumpException3', [], 'http://path/to/file.js', '52'));
                expect(stackFrames[2]).toEqual(new StackFrame('onclick', [], 'http://path/to/file.js', '82'));
            });

            it('should parse Safari 7 Error.stack', function() {
                var stackFrames = unit.parse(CapturedExceptions.SAFARI_7);
                expect(stackFrames).toBeTruthy();
                expect(stackFrames.length).toBe(3);
                expect(stackFrames[0]).toEqual(new StackFrame('', [], 'http://path/to/file.js', '48', '22'));
                expect(stackFrames[1]).toEqual(new StackFrame('foo', [], 'http://path/to/file.js', '52', '15'));
                expect(stackFrames[2]).toEqual(new StackFrame('bar', [], 'http://path/to/file.js', '108', '107'));
            });

            it('should parse Firefox 31 Error.stack', function() {
                var stackFrames = unit.parse(CapturedExceptions.FIREFOX_31);
                expect(stackFrames).toBeTruthy();
                expect(stackFrames.length).toBe(2);
                expect(stackFrames[0]).toEqual(new StackFrame('foo', [], 'http://path/to/file.js', '41', '13'));
                expect(stackFrames[1]).toEqual(new StackFrame('bar', [], 'http://path/to/file.js', '1', '1'));
            });

            it('should parse V8 Error stacks', function() {
                var stackFrames = unit.parse(CapturedExceptions.CHROME_15);
                expect(stackFrames).toBeTruthy();
                expect(stackFrames.length).toBe(4);
                expect(stackFrames[0]).toEqual(new StackFrame('bar', [], 'http://path/to/file.js', '13', '17'));
                expect(stackFrames[1]).toEqual(new StackFrame('bar', [], 'http://path/to/file.js', '16', '5'));
                expect(stackFrames[2]).toEqual(new StackFrame('foo', [], 'http://path/to/file.js', '20', '5'));
                expect(stackFrames[3]).toEqual(new StackFrame('', [], 'http://path/to/file.js', '24', '4'));
            });

            it('should parse IE 10 Error stacks', function() {
                var stackFrames = unit.parse(CapturedExceptions.IE_10);
                expect(stackFrames).toBeTruthy();
                expect(stackFrames.length).toBe(3);
                expect(stackFrames[0]).toEqual(new StackFrame('', [], 'http://path/to/file.js', '48', '13'));
                expect(stackFrames[1]).toEqual(new StackFrame('foo', [], 'http://path/to/file.js', '46', '9'));
                expect(stackFrames[2]).toEqual(new StackFrame('bar', [], 'http://path/to/file.js', '82', '1'));
            });

            it('should parse Opera 9.27 Error messages', function() {
                var stackFrames = unit.parse(CapturedExceptions.OPERA_927);
                expect(stackFrames).toBeTruthy();
                expect(stackFrames.length).toBe(3);
                expect(stackFrames[0]).toEqual(new StackFrame('bar', [], 'http://path/to/file.js', '42'));
                expect(stackFrames[1]).toEqual(new StackFrame('bar', [], 'http://path/to/file.js', '27'));
                expect(stackFrames[2]).toEqual(new StackFrame('foo', [], 'http://path/to/file.js', '18'));
            });

            it('should parse Opera 11 Error messages', function() {
                var stackFrames = unit.parse(CapturedExceptions.OPERA_11);
                expect(stackFrames).toBeTruthy();
                expect(stackFrames.length).toBe(4);
                expect(stackFrames[0]).toEqual(new StackFrame('run', [], 'http://path/to/file.js', '27'));
                expect(stackFrames[0]).toEqual(new StackFrame('bar', [], 'http://path/to/file.js', '18'));
                expect(stackFrames[1]).toEqual(new StackFrame('bar', [], 'http://path/to/file.js', '11'));
                expect(stackFrames[2]).toEqual(new StackFrame('', [], 'http://path/to/file.js', '15'));
            });
        });
    });
});
