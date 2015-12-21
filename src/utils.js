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

        return self;
    };
})();