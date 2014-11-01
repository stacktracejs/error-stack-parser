BROWSERS=ChromeCanary

test:
	@$(MAKE) lint
	@NODE_ENV=test ./node_modules/karma/bin/karma start --single-run --browsers $(BROWSERS)

lint:
	./node_modules/.bin/jshint ./spec/error-stack-parser-spec.js ./error-stack-parser.js

test-ci:
	$(MAKE) lint
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test ./node_modules/karma/bin/karma start karma.conf.ci.js --single-run && \
		cat ./coverage/IE\ 7*/lcov.info | ./node_modules/coveralls/bin/coveralls.js --verbose

build: components
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build coverage components template.js

.PHONY: clean test
