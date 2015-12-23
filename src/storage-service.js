(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateStorageSvc', ['$translateStorage', '$translateCache', '$translateEvents', translateStorageSvc]);

    function translateStorageSvc($translateStorage, $translateCache, $translateEvents) {
        var self = this;

        self.config = config;
        self.options = undefined;

        self.cache = {
            get: {
                lang: cacheGetLang,
                translations: cacheGetTranslations
            },
            set: {
                lang: cacheSetLang,
                translations: cacheSetTranslations
            }
        };

        self.storage = {
            get: {
                lang: storageGetLang,
                translations: storageGetTranslations,
                translation: storageGetTranslation
            },
            set: {
                lang: storageSetLang,
                translations: storageSetTranslations
            }
        };

        self.setTranslations = setTranslations;
        self.getTranslations = getTranslations;
        self.getTranslation = getTranslation;

        self.setLang = setLang;
        self.getLang = getLang;

        return self;

        /* CONFIG */
        function config(options) {
            self.options = options;

            var lang = self.cache.get.lang();
            var translations = self.cache.get.translations(lang);

            self.storage.set.lang(lang);
            self.storage.set.translations(lang, translations);
        }

        /* TRANSLATIONS */
        function setTranslations(lang, values) {
            self.storage.set.translations(lang, values);
            self.cache.set.translations(lang, values);

            $translateEvents.translationsUpdated.publish({ lang: lang });
        }

        function getTranslations(lang) {
            return self.storage.get.translations(lang);
        }

        function getTranslation(lang, key) {
            return self.storage.get.translation(lang, key);
        }

        /* LANGUAGE */
        function setLang(lang) {
            var oldLang = self.storage.get.lang();

            self.storage.set.lang(lang);
            self.cache.set.lang(lang);

            if (!$translateStorage.exists(lang)) {
                var translations = self.cache.get.translations(lang);
                self.storage.set.translations(lang, translations);
            }

            $translateEvents.langChanged.publish({ from: oldLang, to: lang });
        }

        function getLang() {
            return self.storage.get.lang();
        }

        /* CACHE */
        function cacheGetLang() {
            var lang = undefined;

            if (self.options.cache.lang) {
                lang = $translateCache.getLang();
            }

            if (!lang) {
                lang = self.options.defaultLang;
            }

            return lang;
        }

        function cacheSetLang(lang) {
            if (!self.options.cache.lang) return;

            $translateCache.setLang(lang);
        }

        function cacheGetTranslations(lang) {
            if (!self.options.cache.translations) return {};

            return $translateCache.getValues(lang);
        }

        function cacheSetTranslations(lang, values) {
            if (!self.options.cache.translations) return;

            $translateCache.setValues(lang, values);
        }

        /* STORAGE */
        function storageGetLang() {
            return self.options.lang;
        }

        function storageSetLang(lang) {
            self.options.lang = lang;
        }

        function storageGetTranslations(lang) {
            return $translateStorage.getValues(lang);
        }

        function storageGetTranslation(lang, key) {
            return $translateStorage.getValue(lang, key);
        }

        function storageSetTranslations(lang, values) {
            $translateStorage.setValues(lang, values);
        }
    }
})();