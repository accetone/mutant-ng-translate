(function () {
    'use strict';

    angular
        .module('mutant-ng-translate', [])
        .factory('$translateStorage', [translateStorage])
        .factory('$translateLoader', ['$http', '$q', translateLoader]);

    function translateStorage() {
        var self = this;

        // DATA
        self.langs = {};

        // GET
        self.getValues = function (lang) {
            if (self.langs.hasOwnProperty(lang)) return self.langs[lang];
            else return null;
        };

        self.getValue = function(lang, key) {
            if (self.langs.hasOwnProperty(lang)
                && self.lang[lang].hasOwnProperty(key)) return self.langs[lang][key];
            else return null;
        };

        // SET
        self.setValues = function (lang, values) {
            if (!self.langs.hasOwnProperty(lang)) {
                self.langs[lang] = {};
            }

            for (var key in values) {
                if (!values.hasOwnProperty(key)) continue;

                self.langs[lang][key] = values[key];
            }
        };

        return self;
    };

    function translateLoader($http, $q) {
        var self = this;
        
        // LOAD
        self.loadPart = function(options) {
            var url = options
                .urlTemplate
                .replace(/{part}/g, options.part)
                .replace(/{lang}/g, options.lang);

            return $q(function(resolve, reject) {
                $http
                    .get(url)
                    .then(function (response) {
                        var values = options.dataTransformation(response.data);
                        resolve(values);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        };

        return self;
    };
})();
