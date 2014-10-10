BROWSERS=Firefox,ChromeCanary,Opera,Safari,PhantomJS

test:
	@$(MAKE) lint
	@NODE_ENV=test ./node_modules/karma/bin/karma start --single-run --browsers $(BROWSERS)

lint:
	./node_modules/.bin/jshint ./spec/error-stack-parser-spec.js ./error-stack-parser.js

test-ci:
	$(MAKE) lint
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test ./node_modules/karma/bin/karma start karma.conf.ci.js --single-run && \
		cat ./coverage/Chrome*/lcov.info | ./node_modules/coveralls/bin/coveralls.js --verbose

browser:
	open spec/spec-runner.html

phantom:
	/usr/bin/env DISPLAY=:1 phantomjs spec/lib/run-jasmine.js spec/spec-runner.html

build: components
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build coverage components template.js

.PHONY: clean test
