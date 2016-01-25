(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateStorageSvc', ['$translateStorage', '$translateCache', '$translateEvents', translateStorageSvc]);

    /**
     * @ngdoc service
     * @name translate.storageService
     * @requires translate.storage
     * @requires translate.cache
     * @requires translate.events
     * 
     * @description 
     * Service responsible for managing storing and caching processes
     */
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
        /**
         * @ngdoc method
         * @methodOf translate.storageService
         * @name config
         * 
         * @param {Object} options Options
         * 
         * @description 
         * Initialize storage service with options (cache info and default language).
         * Choose language to work and load translations from cache.
         * Always called by {@link translate.$translate $translate} during initialization process 
         */
        function config(options) {
            self.options = options;

            var lang = self.cache.get.lang();
            var translations = self.cache.get.translations(lang);

            self.storage.set.lang(lang);
            self.storage.set.translations(lang, translations);
        }

        /* TRANSLATIONS */
        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name setTranslations
         * 
         * @param {string} lang Language
         * @param {Object<string, string>} values Translations Hashmap
         * 
         * @description 
         * Put given translations for given language into storage and cache. 
         * Fire translations updated event
         */
        function setTranslations(lang, values) {
            self.storage.set.translations(lang, values);
            self.cache.set.translations(lang, values);

            $translateEvents.translationsUpdated.publish({ lang: lang });
        }

        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name getTranslations
         * 
         * @param {string} lang Language
         * @returns {Object<string, string>} Translations Hashmap 
         * 
         * @description 
         * Return translations hashmap for given language from storage
         */
        function getTranslations(lang) {
            return self.storage.get.translations(lang);
        }

        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name getTranslation
         * 
         * @param {string} lang Language
         * @param {string} key Translation key
         * @returns {string} Translation
         * 
         * @description 
         * Return translation for given language and translation key.
         * If translation with this key not exist will use key resolver
         */
        function getTranslation(lang, key) {
            return self.storage.get.translation(lang, key);
        }

        /* LANGUAGE */
        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name setLang
         * 
         * @param {string} lang Language
         * 
         * @description 
         * Put given language to cache and storage.
         * Load translations for new language from cache to storage.
         * Fire language changed event
         */
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

        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name getLang
         * 
         * @returns {string} Language 
         * 
         * @description 
         * Return language from storage
         */
        function getLang() {
            return self.storage.get.lang();
        }

        /* CACHE */
        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name cacheGetLang
         * 
         * @returns {string} Language 
         * 
         * @description 
         * Return language from cache. 
         * If cache disabled will return default language
         */
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

        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name cacheSetLang
         * 
         * @param {string} lang Language
         * 
         * @description 
         * Put language to cache if it enabled
         */
        function cacheSetLang(lang) {
            if (!self.options.cache.lang) return;

            $translateCache.setLang(lang);
        }

        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name cacheGetTranslations
         * 
         * @param {string} lang Language
         * @returns {Object<string, string>} Translations Hashmap
         * 
         * @description 
         * Return translations hashmap for given language from cache.
         * If cache disabled will return empty object
         */
        function cacheGetTranslations(lang) {
            if (!self.options.cache.translations) return {};

            return $translateCache.getValues(lang);
        }

        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name cacheSetTranslations
         * 
         * @param {string} lang Language
         * @param {Object<string, string>} values Translations Hashmap
         * 
         * @description 
         * Put given translations hashmap for given language to cache if it enabled
         */
        function cacheSetTranslations(lang, values) {
            if (!self.options.cache.translations) return;

            $translateCache.setValues(lang, values);
        }

        /* STORAGE */
        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name storageGetLang
         * 
         * @returns {string} Language 
         * 
         * @description 
         * Return language from storage (decorate options.lang)
         */
        function storageGetLang() {
            return self.options.lang;
        }

        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name storageSetLang
         * 
         * @param {string} lang Language
         * 
         * @description 
         * Put given language to storage (decorate options.lang)
         */
        function storageSetLang(lang) {
            self.options.lang = lang;
        }

        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name storageGetTranslations
         * 
         * @param {string} lang Language
         * @returns {Object<string, string>} Translations Hashmap
         * 
         * @description 
         * Return translations hashmap for given language from storage
         */
        function storageGetTranslations(lang) {
            return $translateStorage.getValues(lang);
        }

        /**
         * @ngdoc method
         * @methodOf translate.storageService 
         * @name storageGetTranslation
         * 
         * @param {string} lang Language
         * @param {string} key Translation Key
         * @returns {string} Translation 
         * 
         * @description 
         * Return translation for given translation key and language from storage
         */
        function storageGetTranslation(lang, key) {
            return $translateStorage.getValue(lang, key, self.options.keyResolver);
        }

        /**
         * @ngdoc method
         * @methodOf translate.storageService
         * @name storageSetTranslations
         * 
         * @param {string} lang Language
         * @param {Object<string, string>} values Translations Hashmap
         * 
         * @description 
         * Put given translations hashmap for given language to storage
         */
        function storageSetTranslations(lang, values) {
            $translateStorage.setValues(lang, values);
        }
    }
})();