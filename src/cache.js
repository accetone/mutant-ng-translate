(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateCache', ['$window', translateCache]);

    /**
     * @ngdoc service
     * @name translate.cache
     * @requires $window
     * 
     * @description 
     * Service responsible for caching the translations data and prefered language in local storage, if it supported by browser
     */
    function translateCache($window) {
        var self = this;

        self.local = {
            prefix: 'mutant-ng-translate-',
            isSupported: isSupportLocalStorage(),
            storage: $window.localStorage,
            get: getFromLocalStorage,
            put: putToLocalStorage,
            exists: existsInLocalStorage
        };

        self.cache = {
            getValues: getValuesFromCache,
            setValues: setValuesToCache,
            getLang: getLangFromCache,
            setLang: setLangToCache
        };

        return self.cache;

        // LOCAL STORAGE
        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name isSupportLocalStorage
         * 
         * @returns {boolean} Is Support
         * 
         * @description 
         * Check if browser support localstorage
         */
        function isSupportLocalStorage() {
            try {
                $window.localStorage.setItem('test', 'test');
                $window.localStorage.removeItem('test');

                return true;
            } catch (exception) {
                return false;
            }
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name getFromLocalStorage
         * 
         * @param {string} key Key
         * @returns {Object | string} Value
         * 
         * @description 
         * Get value by given key from local storage
         */
        function getFromLocalStorage(key) {
            if (!self.local.storage[key]) return undefined;
            return JSON.parse(self.local.storage[key]);
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name putToLocalStorage
         * 
         * @param {string} key Key
         * @param {Object | string} obj Object
         * 
         * @description 
         * Put value into local storage by given key
         */
        function putToLocalStorage(key, obj) {
            self.local.storage[key] = JSON.stringify(obj);
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name existsInLocalStorage
         * 
         * @param {string} key Key
         * @returns {boolean} Is Exists
         * 
         * @description 
         * Check if given key exists in local storage
         */
        function existsInLocalStorage(key) {
            return !!self.local.storage[key];
        }

        // CACHE
        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name getValuesFromCache
         * 
         * @param {string} lang Language
         * @returns {Object<string, string>} Values Hashmap
         * 
         * @description 
         * Return values hashmap from local storage for given language.
         * If local storage not supported or hashmap for given language not exists will return empty object
         */
        function getValuesFromCache(lang) {
            if (!self.local.isSupported) return {};

            var lsKey = self.local.prefix + lang;

            if (!self.local.exists(lsKey)) {
                self.local.put(lsKey, {});
            }

            return self.local.get(lsKey);
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name setValuesToCache
         * 
         * @param {string} lang Language
         * @param {Object<string, string>} values Values Hashmap
         * 
         * @description 
         * Merge local storage hashmap for given language with passed hashmap and put result to local storage.
         * If local storage not supported will do nothing
         */
        function setValuesToCache(lang, values) {
            if (!self.local.isSupported) return;

            var lsKey = self.local.prefix + lang;
            var cacheValues = self.cache.getValues(lang);

            angular.merge(cacheValues, values);

            self.local.put(lsKey, cacheValues);
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name getLangFromCache
         * 
         * @returns {string | undefined} Language
         * 
         * @description 
         * Return langugage from local storage.
         * If local storage not supported or language not exists in local storage will return undefined
         */
        function getLangFromCache() {
            if (!self.local.isSupported) return undefined;

            var lsKey = self.local.prefix + 'lang';

            return self.local.get(lsKey);
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name setLangToCache
         * 
         * @param {string} lang Language
         * 
         * @description 
         * Put language to local storage.
         * If local storage not supported will do nothing
         */
        function setLangToCache(lang) {
            if (!self.local.isSupported) return;

            var lsKey = self.local.prefix + 'lang';

            self.local.put(lsKey, lang);
        }
    };
})();