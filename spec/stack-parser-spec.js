/* global ErrorParser: false, CapturedExceptions: false */

describe('error-parser.js', function() {
    describe('ErrorParser', function() {
        describe('#chooseParser', function() {
            var unit = new ErrorParser();
            it('should detect V8', function() {
                expect(unit.chooseParser(CapturedExceptions.CHROME_15)).toBe(unit.parseV8);
                expect(unit.chooseParser(CapturedExceptions.CHROME_34)).toBe(unit.parseV8);
            });
            it('should detect Firefox', function() {
                expect(unit.chooseParser(CapturedExceptions.FIREFOX_3)).toBe(unit.parseSpiderMonkey);
                expect(unit.chooseParser(CapturedExceptions.FIREFOX_7)).toBe(unit.parseSpiderMonkey);
                expect(unit.chooseParser(CapturedExceptions.FIREFOX_14)).toBe(unit.parseSpiderMonkey);
            });
            it('should detect Safari', function() {
                expect(unit.chooseParser(CapturedExceptions.SAFARI_6)).toBe(unit.parseNitro);
            });
            it('should detect IE', function() {
                expect(unit.chooseParser(CapturedExceptions.IE_10)).toBe(unit.parseChakra);
            });
            it('should detect Opera', function() {
                expect(unit.chooseParser(CapturedExceptions.OPERA_854)).toBe(unit.parseOPERA);
                expect(unit.chooseParser(CapturedExceptions.OPERA_902)).toBe(unit.parseOPERA);
                expect(unit.chooseParser(CapturedExceptions.OPERA_927)).toBe(unit.parseOPERA);
                expect(unit.chooseParser(CapturedExceptions.OPERA_1010)).toBe(unit.parseOPERA);
                expect(unit.chooseParser(CapturedExceptions.OPERA_1063)).toBe(unit.parseOPERA);
                expect(unit.chooseParser(CapturedExceptions.OPERA_1111)).toBe(unit.parseOPERA);
                expect(unit.chooseParser(CapturedExceptions.OPERA_1151)).toBe(unit.parseOPERA);
            });
        });

        describe('#parseNitro', function() {
            var unit = new ErrorParser();
            it('should parse Safari 6 Errors', function() {
                var errorInfo = unit.parseNitro(CapturedExceptions.SAFARI_6);
                expect(errorInfo.stack).toBeTruthy();
                expect(errorInfo.stack.length).toBe(3);
                expect(errorInfo.stack[0]).toEqual({fn: '{anonymous}', args: [], src: 'scheme://path/to/file.js', line: '48', column: undefined});
                expect(errorInfo.stack[1]).toEqual({fn: 'dumpException3', args: [], src: 'scheme://path/to/file.js', line: '52', column: undefined});
                expect(errorInfo.stack[2]).toEqual({fn: 'onclick', args: [], src: 'scheme://path/to/file.js', line: '82', column: undefined});
                expect(errorInfo.message).toBeTruthy();
                expect(errorInfo.message).toEqual("'null' is not an object (evaluating 'x.undef')");
            });
        });

        describe('#parseV8', function() {
            var unit = new ErrorParser();
            it('should parse V8 Errors', function() {
                var errorInfo = unit.parseV8(CapturedExceptions.CHROME_15);
                expect(errorInfo.stack).toBeTruthy();
                expect(errorInfo.stack[0]).toEqual({fn: 'bar', args: [], src: 'scheme://path/to/file.js', line: '13', column: '17'});
                expect(errorInfo.stack[1]).toEqual({fn: 'bar', args: [], src: 'scheme://path/to/file.js', line: '16', column: '5'});
                expect(errorInfo.stack[2]).toEqual({fn: 'foo', args: [], src: 'scheme://path/to/file.js', line: '20', column: '5'});
                expect(errorInfo.stack[3]).toEqual({fn: '{anonymous}', args: [], src: 'scheme://path/to/file.js', line: '24', column: '4'});
                expect(errorInfo.stack.length).toBe(4);
            });
        });

        describe('#parseChakra', function() {

        });
    });
});
