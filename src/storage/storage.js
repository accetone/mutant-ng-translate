(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateStorage', [translateStorage]);

    function translateStorage() {
        var self = this;

        self.langs = {};

        self.getValues = getValues;
        self.setValues = setValues;

        return self;

        function getValues(lang) {
            if (!self.langs.hasOwnProperty(lang)) {
                self.langs[lang] = {};
            }

            return self.langs[lang];
        }

        function setValues(lang, values) {
            if (!self.langs.hasOwnProperty(lang)) {
                self.langs[lang] = {};
            }

            angular.extend(self.langs[lang], values);
        }
    };
})();