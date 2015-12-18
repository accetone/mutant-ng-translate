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
                language: cacheGetLanguage,
                translations: cacheGetTranslations
            },
            set: {
                language: cacheSetLanguage,
                translations: cacheSetTranslations
            }
        };

        self.storage = {
            get: {
                language: storageGetLanguage,
                translations: storageGetTranslations,
                translation: storageGetTranslation
            },
            set: {
                language: storageSetLanguage,
                translations: storageSetTranslations
            }
        };

        self.setTranslations = setTranslations;
        self.getTranslations = getTranslations;
        self.getTranslation = getTranslation;

        self.setLanguage = setLanguage;
        self.getLanguage = getLanguage;

        return self;

        /* CONFIG */
        function config(options) {
            self.options = options;

            var lang = self.cache.get.language();
            var translations = self.cache.get.translations(lang);

            self.storage.set.language(lang);
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
        function setLanguage(lang) {
            var oldLang = self.storage.get.language();

            self.storage.set.language(lang);
            self.cache.set.language(lang);

            if (!$translateStorage.exists(lang)) {
                var translations = self.cache.get.translations(lang);
                self.storage.set.translations(lang, translations);
            }

            $translateEvents.languageChanged.publish({ from: oldLang, to: lang });
        }

        function getLanguage() {
            return self.storage.get.language();
        }

        /* CACHE */
        function cacheGetLanguage() {
            var lang = undefined;

            if (self.options.cacheSelectedLang) {
                lang = $translateCache.getLang();
            }

            if (!lang) {
                lang = self.options.defaultLang;
            }

            return lang;
        }

        function cacheSetLanguage(lang) {
            if (!self.options.cacheSelectedLang) return;

            $translateCache.setLang(lang);
        }

        function cacheGetTranslations(lang) {
            if (!self.options.cacheTranslations) return {};

            return $translateCache.getValues(lang);
        }

        function cacheSetTranslations(lang, values) {
            if (!self.options.cacheTranslations) return;

            $translateCache.setValues(lang, values);
        }

        /* STORAGE */
        function storageGetLanguage() {
            return self.options.lang;
        }

        function storageSetLanguage(lang) {
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