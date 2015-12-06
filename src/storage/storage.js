(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateStorage', ['$translateEvents', translateStorage]);

    function translateStorage($translateEvents) {
        var self = this;

        self.langs = {};

        self.getValues = getValues;
        self.getValue = getValue;
        self.setValues = setValues;

        return self;

        function getValues(lang) {
            if (!self.langs.hasOwnProperty(lang)) {
                self.langs[lang] = {};
            }

            return self.langs[lang];
        }

        function getValue(lang, key) {
            if (!self.langs.hasOwnProperty(lang) || !self.langs[lang].hasOwnProperty(key)) {
                return key;
            }

            return self.langs[lang][key];
        }

        function setValues(lang, values) {
            if (!self.langs.hasOwnProperty(lang)) {
                self.langs[lang] = {};
            }

            angular.extend(self.langs[lang], values);

            $translateEvents.translationsUpdated.publish();
        }
    };
})();