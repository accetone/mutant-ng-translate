/// <binding ProjectOpened='watch, server, tests' />
var gulp = require('gulp');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var karmaServer = require('karma').Server;
var docs = require('gulp-ngdocs');

gulp.task('build', function () {
    return gulp
        .src(['./src/translate.js', './src/**/*.js'])
        .pipe(concat('mutant-ng-translate.js'))
        .pipe(gulp.dest('./build/'));
});

gulp.task('watch', function () {
    gulp.watch('./src/**/*.js', ['build', 'docs']);
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

gulp.task('docs', function () {
    var options = {
        scripts: [
            'bower_components/angular/angular.min.js',
            'bower_components/angular/angular.min.js.map',
            'bower_components/angular-animate/angular-animate.min.js',
            'bower_components/angular-animate/angular-animate.min.js.map',
            'bower_components/marked/marked.min.js',
            'bower_components/marked/marked.js.map'
        ],
        html5Mode: false
    };

    return gulp.src(['./src/**/*.js', ''])
        .pipe(docs.process(options))
        .on('error', swallowError)
        .pipe(gulp.dest('./docs'));
});

function swallowError(error) {
    console.log(error.toString());

    this.emit('end');
}