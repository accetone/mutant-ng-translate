(function () {
    'use strict';

    angular.module('mutant-ng-translate', [])
        .factory('$translateStorage', [translateStorage]);

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
})();
