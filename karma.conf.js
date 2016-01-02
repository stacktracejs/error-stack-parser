module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'node_modules/stackframe/dist/stackframe.js',
            'error-stack-parser.js',
            'spec/fixtures/captured-errors.js',
            'spec/spec-helper.js',
            'spec/*-spec.js'
        ],
        reporters: ['spec'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        //browsers: ['ChromeCanary', 'Firefox', 'Opera', 'Safari'],
        browsers: ['PhantomJS2'],
        singleRun: false
    });
};
