var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('build', function () {
    return gulp
        .src(['./src/translate.js', './src/**/*.js'])
        .pipe(concat('mutant-ng-translate.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.js', ['build']);
});