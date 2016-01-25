(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateLoader', ['$http', '$q', translateLoader]);

    /**
     * @ngdoc service
     * @name translate.loader
     * @requires $http
     * @requires $q
     * 
     * @description 
     * Service responsible for loading parts
     */
    function translateLoader($http, $q) {
        var self = this;

        self.loadPart = loadPart;

        return self;

        /**
         * @ngdoc method
         * @methodOf translate.loader
         * @name loadPart
         * 
         * @param {Object} options Options
         * @returns {Promise} Loading Promise
         * 
         * @description 
         * Start part loading with given options and return promise.
         * Promise will be resolved after loading complete.
         * Transform received from server data with data transformation function.
         * Transformed data will be passed with promise resolve.
         */
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
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        }
    };
})();