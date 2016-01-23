(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateStorage', [translateStorage]);

    function translateStorage() {
        var self = this;

        self.langs = {};

        self.getValues = getValues;
        self.getValue = getValue;
        self.setValues = setValues;

        self.exists = exists;

        return self;

        function getValues(lang) {
            if (!self.exists(lang)) {
                self.langs[lang] = {};
            }

            return self.langs[lang];
        }

        function getValue(lang, key, resolver) {
            if (!self.exists(lang, key)) {
                if (typeof resolver === 'function') {
                    return resolver(key);
                } else {
                    return key;
                }
            }

            return self.langs[lang][key];
        }

        function setValues(lang, values) {
            if (!self.langs.hasOwnProperty(lang)) {
                self.langs[lang] = {};
            }

            angular.merge(self.langs[lang], values);
        }

        function exists(lang, key) {
            if (!self.langs.hasOwnProperty(lang)) return false;

            if (!!key && !self.langs[lang].hasOwnProperty(key)) return false;

            return true;
        }
    };
})();