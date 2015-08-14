var concat = require('gulp-concat');
var coveralls = require('gulp-coveralls');
var del = require('del');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var karma = require('karma').server;
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var polyfills = ['./polyfills.js'];
var dependencies = ['./node_modules/stackframe/dist/stackframe.js'];
var source = 'error-stack-parser.js';

gulp.task('lint', function () {
    return gulp.src(source)
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('test-ci', ['dist'], function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.ci.js',
        singleRun: true
    }, done);
});

gulp.task('copy', function () {
    return gulp.src(source)
        .pipe(gulp.dest('dist'));
});

gulp.task('dist', ['copy'], function() {
    // Separate distribution for old browsers
    gulp.src(polyfills.concat(dependencies.concat(source)))
        .pipe(sourcemaps.init())
        .pipe(concat(source.replace('.js', '-with-polyfills.min.js')))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));

    return gulp.src(dependencies.concat(source))
        .pipe(sourcemaps.init())
        .pipe(concat(source.replace('.js', '.min.js')))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['build', 'coverage', 'dist']));

gulp.task('ci', ['lint', 'test-ci'], function () {
    gulp.src('./coverage/**/lcov.info')
        .pipe(coveralls());
});

gulp.task('default', ['clean'], function (cb) {
    runSequence('lint', 'dist', 'test', cb);
});
