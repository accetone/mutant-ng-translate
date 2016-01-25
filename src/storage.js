(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateStorage', [translateStorage]);

    /**
     * @ngdoc service
     * @name translate.storage
     * 
     * @description 
     * Service responsible for storing the translations data while app is running
     */
    function translateStorage() {
        var self = this;

        self.langs = {};

        self.getValues = getValues;
        self.getValue = getValue;
        self.setValues = setValues;

        self.exists = exists;

        return self;

        /**
         * @ngdoc method
         * @methodOf translate.storage
         * @name getValues
         * 
         * @param {string} lang Language
         * @returns {Object.<string, string>} Values Hashmap
         * 
         * @description 
         * Return values hashmap for given language
         */
        function getValues(lang) {
            if (!self.exists(lang)) {
                self.langs[lang] = {};
            }

            return self.langs[lang];
        }

        /**
         * @ngdoc method
         * @methodOf translate.storage
         * @name getValue
         * 
         * @param {string} lang Language
         * @param {string} key Key
         * @returns {string} Value
         * 
         * @description 
         * Return value by key from language hashmap
         */
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

        /**
         * @ngdoc method
         * @methodOf translate.storage
         * @name setValues
         * 
         * @param {string} lang Language
         * @param {Object.<string, string>} values Values Hashmap
         * 
         * @description 
         * Merge existing hashmap for given language with passed hashmap. 
         * If hashmap not exists, will create empty object first
         */
        function setValues(lang, values) {
            if (!self.langs.hasOwnProperty(lang)) {
                self.langs[lang] = {};
            }

            angular.merge(self.langs[lang], values);
        }

        /**
         * @ngdoc method
         * @methodOf translate.storage
         * @name exists
         * 
         * @param {string} lang Language
         * @param {string} key Key
         * @returns {boolean} Is Exists
         * 
         * @description 
         * Check if key exists in language hashmap 
         */
        function exists(lang, key) {
            if (!self.langs.hasOwnProperty(lang)) return false;

            if (!!key && !self.langs[lang].hasOwnProperty(key)) return false;

            return true;
        }
    };
})();