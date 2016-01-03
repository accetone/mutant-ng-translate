(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateUtils', [tranlslateUtils]);

    function tranlslateUtils() {
        var self = this;

        self.directDataTransformation = function (values) {
            return values;
        };

        self.error = {
            prefix: '[mutant-ng-translate]: ',
            throw: function (message) {
                throw new Error(self.error.prefix + message);
            }
        };

        self.warning = {
            write: console != undefined
                && console.warn != undefined
                && typeof console.warn === 'function'
                ? console.warn
                : function() {},
            throw: function(message) {
                self.warning.write(self.error.prefix + message);
            }
        };

        return self;
    };
})();