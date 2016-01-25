(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .directive('ngTranslate', ['$translate', '$translateEvents', translateDirective]);

    /**
     * @ngdoc directive
     * @name translate.directive:ngTranslate
     * @restrict 'A'
     * @element ANY
     * @requires translate.$translate
     * @requires translate.events
     * 
     * @param {string} ngTranslate Translation key
     * 
     * @description 
     * Transform any html element to the translation container. 
     * Translations get from {@link translate.$translate $translate} service by specified key
     */
    function translateDirective($translate, $translateEvents) {
        var link = function (scope, element, attrs) {
            element = element[0];

            var translitionKey = attrs['ngTranslate'];

            var update = function() {
                element.innerHTML = $translate.translation(translitionKey);
            };

            $translateEvents.translationsUpdated.subscribe(update);
            $translateEvents.langChanged.subscribe(update);

            element.innerHTML = $translate.translation(translitionKey);
        };

        return {
            restrict: 'A',
            link: link
        };
    };
})();