var gulp = require('gulp');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');

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