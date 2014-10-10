module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'bower_components/stackframe/stackframe.js',
            'error-stack-parser.js',
            'spec/captured-errors.js',
            'spec/spec-helper.js',
            'spec/*-spec.js'
        ],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'error-stack-parser.js': 'coverage'
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Firefox', 'ChromeCanary', 'Opera', 'Safari', 'PhantomJS'],
        singleRun: false
    });
};
