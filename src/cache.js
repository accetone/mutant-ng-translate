(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateCache', ['$window', translateCache]);

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
        function isSupportLocalStorage() {
            try {
                $window.localStorage.setItem('test', 'test');
                $window.localStorage.removeItem('test');

                return true;
            } catch (exception) {
                return false;
            }
        }

        function getFromLocalStorage(key) {
            if (!self.local.storage[key]) return undefined;
            return JSON.parse(self.local.storage[key]);
        };

        function putToLocalStorage(key, obj) {
            self.local.storage[key] = JSON.stringify(obj);
        };

        function existsInLocalStorage(key) {
            return !!self.local.storage[key];
        };

        // CACHE
        function getValuesFromCache(lang) {
            if (!self.local.isSupported) return {};

            var lsKey = self.local.prefix + lang;

            if (!self.local.exists(lsKey)) {
                self.local.put(lsKey, {});
            }

            return self.local.get(lsKey);
        }

        function setValuesToCache(lang, values) {
            if (!self.local.isSupported) return;

            var lsKey = self.local.prefix + lang;
            var cacheValues = self.cache.getValues(lang);

            angular.merge(cacheValues, values);

            self.local.put(lsKey, cacheValues);
        }

        function getLangFromCache() {
            var lsKey = self.local.prefix + 'lang';

            return self.local.get(lsKey);
        }

        function setLangToCache(lang) {
            var lsKey = self.local.prefix + 'lang';

            self.local.put(lsKey, lang);
        }
    };
})();