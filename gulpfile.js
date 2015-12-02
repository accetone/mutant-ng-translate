var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('default', function () {
    return gulp
        .src('./src/**/*.js')
        .pipe(concat('mutant-ng-translate.js'))
        .pipe(gulp.dest('./build/'));
});