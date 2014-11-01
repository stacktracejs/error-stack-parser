error-stack-parser.js - Extract meaning from JS Errors
===============
[![Build Status](https://travis-ci.org/stacktracejs/error-stack-parser.svg?branch=master)](https://travis-ci.org/stacktracejs/error-stack-parser) [![Coverage Status](https://img.shields.io/coveralls/stacktracejs/error-stack-parser.svg)](https://coveralls.io/r/stacktracejs/error-stack-parser) [![Code Climate](https://codeclimate.com/github/stacktracejs/error-stack-parser/badges/gpa.svg)](https://codeclimate.com/github/stacktracejs/error-stack-parser)

## Usage
```
ErrorStackParser.parse(new Error("sample"));

=> [StackFrame('funName1', [], 'path/to/file.js', 35, 79), StackFrame(..)]
```

## Installation
```
npm install error-stack-parser
bower install error-stack-parser
component install error-stack-parser
https://raw.githubusercontent.com/stacktracejs/error-stack-parser/master/error-stack-parser.js
```
