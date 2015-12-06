(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .directive('ngTranslate', ['$translate', '$translateEvents', translateDirective]);

    function translateDirective($translate, $translateEvents) {
        var link = function (scope, element, attrs) {
            element = element[0];

            var translitionKey = attrs['ngTranslate'];

            $translateEvents.translationsUpdated.subscribe(function() {
                element.innerHTML = $translate.translation(translitionKey);
            });

            element.innerHTML = $translate.translation(translitionKey);
        };

        return {
            restrict: 'A',
            link: link
        };
    };
})();