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

        self.validateOptions = function (options) {
            if (!options.defaultLang) {
                throw new Error('[mutant-ng-translate]: you didn\'t specify default language');
            }
        };

        return self;
    };
})();