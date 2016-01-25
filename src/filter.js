(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .filter('translate', ['$translate', translateFilter]);

    /**
     * @ngdoc filter
     * @name translate.filter:translate
     * @function
     * @requires translate.$translate
     * 
     * @param {string} translate_expression Translation key
     * 
     * @description 
     * Transform translation key into translation
     */
    function translateFilter($translate) {
        var filter = function(key) {
            return $translate.translation(key);
        };

        filter.$stateful = true;

        return filter;
    };
})();