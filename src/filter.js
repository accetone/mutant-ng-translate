(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .filter('translate', ['$translate', translateFilter]);

    function translateFilter($translate) {
        var filter = function(key) {
            return $translate.translation(key);
        };

        filter.$stateful = true;

        return filter;
    };
})();