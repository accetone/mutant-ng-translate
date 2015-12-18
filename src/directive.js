(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .directive('ngTranslate', ['$translate', '$translateEvents', translateDirective]);

    function translateDirective($translate, $translateEvents) {
        var link = function (scope, element, attrs) {
            element = element[0];

            var translitionKey = attrs['ngTranslate'];

            var update = function() {
                element.innerHTML = $translate.translation(translitionKey);
            };

            $translateEvents.translationsUpdated.subscribe(update);
            $translateEvents.languageChanged.subscribe(update);

            element.innerHTML = $translate.translation(translitionKey);
        };

        return {
            restrict: 'A',
            link: link
        };
    };
})();