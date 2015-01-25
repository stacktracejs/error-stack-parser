SHELL := /bin/bash
PATH := node_modules/.bin:./node_modules/karma/bin:$(PATH)

sources				:= error-stack-parser.js
minified            := $(sources:%.js=%.min.js)
source_map          := $(sources:%.js=%.js.map)
specs				:= $(wildcard spec/*-spec.js)
build_files			:= build/jshint.xml
coveralls			:= node_modules/coveralls/bin/coveralls.js

build/jshint.xml: $(sources) $(specs)
	mkdir -p $(dir $@)
	node_modules/.bin/jshint $^
	jshint --reporter checkstyle $^ > $@

test: $(build_files)
	@NODE_ENV=test karma start --single-run

test-ci: $(build_files)
	@echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@NODE_ENV=test karma start karma.conf.ci.js --single-run && \
		cat ./coverage/Chrome*/lcov.info | $(coveralls) --verbose

clean:
	rm -fr build coverage dist *.log

dist: $(build_files) $(sources)
	mkdir $@
	uglifyjs2 $(sources) -o $(minified) --source-map $(source_map)
	mv $(minified) $(source_map) $@
	cp $(sources) $@

ci: clean test-ci

all: clean test dist

.PHONY: all
