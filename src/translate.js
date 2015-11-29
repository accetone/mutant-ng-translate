(function () {
    'use strict';

    angular
        .module('mutant-ng-translate', [])
        .factory('$translateUtils', [tranlslateUtils])
        .factory('$translateStorage', [translateStorage])
        .factory('$translateLoader', ['$http', '$q', translateLoader])
        .factory('$translateCache', ['$window', translateCache])
        .factory('$translate', ['$translateUtils', '$translateStorage', '$translateLoader', '$translateCache', translate]);

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

    function translateLoader($http, $q) {
        var self = this;
        
        self.loadPart = loadPart;

        return self;

        function loadPart(options) {
            var url = options
                .urlTemplate
                .replace(/{part}/g, options.part)
                .replace(/{lang}/g, options.lang);

            return $q(function (resolve, reject) {
                $http
                    .get(url)
                    .then(function (response) {
                        var values = options.dataTransformation(response.data);
                        resolve(values);
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        }
    };

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

            angular.extend(cacheValues, values);

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

    function tranlslateUtils() {
        var self = this;

        self.directDataTransformation = function (values) {
            return values;
        };

        self.validateOptions = function(options) {
            if (!options.defaultLang) {
                throw new Error('[mutant-ng-translate]: you didn\'t specify default language');
            }
        };

        return self;
    };

    function translate($tranlslateUtils, $translateStorage, $translateLoader, $translateCache) {
        var self = this;
        
        self.options = {
            dataTransformation: $tranlslateUtils.directDataTransformation,
            cacheTranslations: true,
            cacheSelectedLang: true
        };

        self.init = init;
        self.translations = translations;
        self.use = use;
        self.refresh = refresh;

        self.parts = {
            add: addPart,
            load: loadPart,
            list: []
        };

        self.values = {};

        return self;

        // defaultLang, cacheTranslations, cacheSelectedLang, preloadLanguages, dataTransformation, urlTemplate, validLanguages (if some language depricated and you want remove it from cache)
        function init(options) {
            angular.extend(self.options, options);
            $tranlslateUtils.validateOptions(self.options);

            // cached language
            if (self.options.cacheSelectedLang) {
                self.options.lang = $translateCache.getLang();

                if (!self.options.lang) {
                    self.options.lang = self.options.defaultLang;
                    $translateCache.setLang(self.options.defaultLang);
                }
            } else {
                self.options.lang = self.options.defaultLang;
            }

            // cached translations
            if (self.options.cacheTranslations) {
                var cacheValues = $translateCache.getValues(self.options.lang);
                $translateStorage.setValues(self.options.lang, cacheValues);
            }

            // get values
            self.values = $translateStorage.getValues(self.options.lang);
        }

        function translations(lang, values) {
            if (!!values) {
                // cache this values ???
                $translateStorage.setValues(lang, values);
            }

            if (!!lang) return self.values;

            return $translateStorage.getValues(lang);
        }

        function use(lang) {
            self.options.lang = lang;
            $translateCache.setLang(lang);
            self.values = $translateStorage.getValues(lang);

            var cacheValues = $translateCache.getValues(lang);
            $translateStorage.setValues(lang, cacheValues);

            self.refresh();
        }

        function refresh() {
            var lang = self.options.lang;

            for (var i = 0; i < self.parts.list.length; i++) {
                var partOptions = {
                    part: self.parts.list[i],
                    lang: lang,
                    urlTemplate: self.options.urlTemplate,
                    dataTransformation: self.options.dataTransformation
                };

                self.parts.load(partOptions);
            }
        }

        function addPart(part) {
            if (!part) return;

            var partOptions = {
                part: part,
                lang: self.options.lang,
                urlTemplate: self.options.urlTemplate,
                dataTransformation: self.options.dataTransformation
            };

            self.parts.list.push(partOptions.part);

            self.parts.load(partOptions);
        }

        function loadPart(partOptions) {
            $translateLoader
                .loadPart(partOptions)
                .then(function (values) {
                    // TODO: note for which langs part is loaded to avoid reload when switch langugage

                    $translateStorage.setValues(partOptions.lang, values);
                    $translateCache.setValues(partOptions.lang, values);
                });
        }
    };
})();
