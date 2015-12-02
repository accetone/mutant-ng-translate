(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateLoader', ['$http', '$q', translateLoader]);

    function translateLoader($http, $q) {
        var self = this;

        self.loadPart = loadPart;

        return self;

        function loadPart(options) {
            var url = options
                .urlTemplate
                .replace(/{part}/g, options.part)
                .replace(/{lang}/g, options.lang);

            return $q(function (resolve, reject) {
                $http
                    .get(url)
                    .then(function (response) {
                        var values = options.dataTransformation(response.data);
                        resolve(values);
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        }
    };
})();