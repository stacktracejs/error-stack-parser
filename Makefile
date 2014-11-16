BROWSERS=Firefox,ChromeCanary,Opera,Safari

test: build/jshint.xml
	@NODE_ENV=test ./node_modules/karma/bin/karma start --single-run --browsers $(BROWSERS)

build/jshint.xml: build
	./node_modules/.bin/jshint --reporter checkstyle ./spec/error-stack-parser-spec.js ./error-stack-parser.js > build/jshint.xml

test-ci: build/jshint.xml
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test ./node_modules/karma/bin/karma start karma.conf.ci.js --single-run && \
    		cat ./coverage/IE\ 7*/lcov.info | ./node_modules/coveralls/bin/coveralls.js --verbose

clean:
	rm -fr build coverage dist *.log

build:
	mkdir build

dist:
	mkdir dist
	./node_modules/.bin/uglifyjs2 node_modules/stackframe/stackframe.js error-stack-parser.js \
	 	-o error-stack-parser.min.js --source-map error-stack-parser.js.map
	mv error-stack-parser.min.js error-stack-parser.js.map dist/

.PHONY: clean test dist
