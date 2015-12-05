(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .directive('ngTranslate', ['$translate', '$rootScope', translateDirective]);

    function translateDirective($translate, $rootScope) {
        var link = function (scope, element, attrs) {
            element = element[0];

            var translitionKey = attrs['ngTranslate'];

            $rootScope.$on('translationsUpdated', function () {
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