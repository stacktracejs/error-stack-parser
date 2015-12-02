module.exports = function (config) {
    if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
        console.log('Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.');
        process.exit(1);
    }

    // Check out https://saucelabs.com/platforms for all browser/platform combos
    var customLaunchers = {
        slIOS8: {
            base: 'SauceLabs',
            browserName: 'iPhone',
            platform: 'OS X 10.10',
            version: '8.4'
        },
        slIOS9: {
            base: 'SauceLabs',
            browserName: 'iPhone',
            platform: 'OS X 10.11',
            version: '9.1'
        },
        slAndroid4: {
            base: 'SauceLabs',
            browserName: 'Android',
            platform: 'Linux',
            version: '4.4'
        },
        slAndroid5: {
            base: 'SauceLabs',
            browserName: 'Android',
            platform: 'Linux',
            version: '5.1'
        },
        slChrome: {
            base: 'SauceLabs',
            browserName: 'chrome'
        },
        slChromeBeta: {
            base: 'SauceLabs',
            browserName: 'chrome',
            version: 'beta'
        },
        slChromeCanary: {
            base: 'SauceLabs',
            browserName: 'chrome',
            version: 'dev'
        },
        slFirefox42: {
            base: 'SauceLabs',
            browserName: 'firefox',
            platform: 'Windows 8.1',
            version: '42.0'
        },
        slFirefoxDev: {
            base: 'SauceLabs',
            browserName: 'firefox',
            version: 'dev'
        },
        slSafari8: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.10',
            version: '8'
        },
        slSafari9: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.11',
            version: '9'
        },
        slOpera: {
            base: 'SauceLabs',
            browserName: 'opera'
        },
        slEdge20: {
            base: 'SauceLabs',
            browserName: 'microsoftedge',
            platform: 'Windows 10',
            version: '20.10240'
        },
        slIE11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8.1',
            version: '11'
        },
        slIE10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 8',
            version: '10'
        },
        slIE9: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows 7',
            version: '9'
        },
        slIE8: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            platform: 'Windows XP',
            version: '8'
        }
        // Too unreliable on Sauce :(
        //slIE7: {
        //    base: 'SauceLabs',
        //    browserName: 'internet explorer',
        //    platform: 'Windows XP',
        //    version: '7'
        //}
    };

    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'polyfills.js',
            'node_modules/stackframe/dist/stackframe.js',
            'error-stack-parser.js',
            'spec/fixtures/captured-errors.js',
            'spec/spec-helper.js',
            'spec/*-spec.js'
        ],
        exclude: [],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browserDisconnectTimeout : 10000,
        browserDisconnectTolerance : 1,
        browserNoActivityTimeout : 240000,
        captureTimeout : 240000,
        sauceLabs: {
            testName: 'error-stack-parser unit tests',
            recordScreenshots: false,
            connectOptions: {
                port: 5757,
                logfile: 'sauce_connect.log'
            }
        },
        customLaunchers: customLaunchers,
        browsers: Object.keys(customLaunchers),
        reporters: ['progress', 'saucelabs', 'coverage'],
        preprocessors: {
            'error-stack-parser.js': 'coverage'
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage'
        },
        singleRun: true
    });
};
