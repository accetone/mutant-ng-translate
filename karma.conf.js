module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],

        files: [
          'bower_components/angular/angular.js',
          'bower_components/angular-mocks/angular-mocks.js',
          'src/translate.js',
          'src/*.js',
          'tests/*.js'
        ],

        reporters: ['progress'],        

        port: 2001,
        browsers: ['Chrome']
    });
};