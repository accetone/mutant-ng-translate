/// <binding ProjectOpened='watch, server, tests' />
var gulp = require('gulp');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var karmaServer = require('karma').Server;

gulp.task('build', function () {
    return gulp
        .src(['./src/translate.js', './src/**/*.js'])
        .pipe(concat('mutant-ng-translate.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.js', ['build']);
});

gulp.task('server', function() {
    nodemon({
        script: './demo/server.js'
    });
});

gulp.task('tests', function (done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});