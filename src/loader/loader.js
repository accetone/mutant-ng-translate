(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateLoader', ['$http', '$q', '$translateEvents', translateLoader]);

    function translateLoader($http, $q, $translateEvents) {
        var self = this;

        self.loadPart = loadPart;

        return self;

        function loadPart(options) {
            var url = options
                .urlTemplate
                .replace(/{part}/g, options.part.name)
                .replace(/{lang}/g, options.lang);

            return $q(function (resolve, reject) {
                $http
                    .get(url)
                    .then(function (response) {
                        var values = options.dataTransformation(response.data);
                        resolve(values);

                        $translateEvents.partLoaded.publish();
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        }
    };
})();