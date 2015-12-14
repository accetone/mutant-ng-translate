(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translate', ['$translateUtils', '$translateStorage', '$translateLoader', '$translateCache', '$translateEvents', translate]);

    function translate($tranlslateUtils, $translateStorage, $translateLoader, $translateCache, $translateEvents) {
        var self = this;

        self.options = {
            dataTransformation: $tranlslateUtils.directDataTransformation,
            cacheTranslations: true,
            cacheSelectedLang: true
        };
        
        self.config = config;
        self.validateOptions = validateOptions;
        self.initSubscriptions = initSubscriptions;

        self.cache = {
            save: {
                language: cacheSaveLanguage,
                translations: cacheSaveTranslations
            },
            load: {
                language: cacheLoadLanguage,
                translations: cacheLoadTranslations
            }
        };

        self.use = use;
        self.langKey = langKey;

        self.translations = translations;
        self.translation = translation;

        self.parts = {
            list: [],

            add: addParts,
            load: loadPart,
            
            refresh: refresh,

            loadedCounter: 0
        };

        self.callbacks = {
            preload: preloadCallback,
            partLoaded: partLoadedCallback,
            languageChanged: languageChangedCallback
        };

        return self;
        
        /* INITIALIZATION */
        function config(options) {
            angular.extend(self.options, options);
            self.validateOptions();

            self.cache.load.language();
            self.cache.load.translations();

            self.initSubscriptions();
        }

        function validateOptions() {
            $tranlslateUtils.validateOptions(self.options);
        }

        function initSubscriptions() {
            $translateEvents.partLoaded.subscribe(self.callbacks.partLoaded);
            $translateEvents.languageChanged.subscribe(self.callbacks.languageChanged);
            $translateEvents.allPartsLoaded.subscribe(self.callbacks.preload, true);
        }

        /* CACHE */
        function cacheLoadLanguage() {
            if (self.options.cacheSelectedLang) {
                self.options.lang = $translateCache.getLang();

                if (!self.options.lang) {
                    self.options.lang = self.options.defaultLang;
                    $translateCache.setLang(self.options.defaultLang);
                }
            } else {
                self.options.lang = self.options.defaultLang;
            }
        }

        function cacheSaveLanguage(lang) {
            if (!self.options.cacheSelectedLang) return;

            $translateCache.setLang(lang);
        }

        function cacheLoadTranslations() {
            if (!self.options.cacheTranslations) return;

            var cacheValues = $translateCache.getValues(self.options.lang);
            $translateStorage.setValues(self.options.lang, cacheValues);
        }

        function cacheSaveTranslations(lang, values) {
            if (!self.options.cacheTranslations) return;

            $translateCache.setValues(lang, values);
        }

        /* LANGS */
        function use(lang) {
            if (self.options.lang === lang) return;

            self.options.lang = lang;

            self.cache.save.language(lang);
            self.cache.load.translations();

            self.parts.refresh();

            $translateEvents.languageChanged.publish();
        }

        function langKey() {
            return self.options.lang;
        }

        /* TRANSLATIONS */
        function translations(lang, values) {
            if (!!values) {
                $translateStorage.setValues(lang, values);
            }

            if (!!lang) return $translateStorage.getValues(lang);
                
            return $translateStorage.getValues(self.options.lang);
        }

        function translation(key) {
            return $translateStorage.getValue(self.options.lang, key);
        } 

        /* PARTS */
        function addParts() {
            for (var i = 0; i < arguments.length; i++) {
                addPart(arguments[i]);
            }
        }

        function addPart(name) {
            if (!name) return;

            var partOptions = {
                part: { name: name },
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
                    partOptions.part[partOptions.lang] = true;
                    
                    $translateStorage.setValues(partOptions.lang, values);
                    self.cache.to.translations(partOptions.lang, values);
                    
                    $translateEvents.partLoaded.publish(partOptions);
                });
        }

        function loadParts(lang, force) {
            for (var i = 0; i < self.parts.list.length; i++) {
                if (self.parts.list[i][lang] && !force) continue;

                var partOptions = {
                    part: self.parts.list[i],
                    lang: lang,
                    urlTemplate: self.options.urlTemplate,
                    dataTransformation: self.options.dataTransformation
                };

                self.parts.load(partOptions);
            }
        }

        function refresh(force) {
            var lang = self.options.lang;

            loadParts(lang, force);
        }

        /* CALLACKS */
        function partLoadedCallback(partOptions) {
            if (partOptions.lang !== self.options.lang) return;

            self.parts.loadedCounter++;

            if (self.parts.loadedCounter === self.parts.list.length) {
                $translateEvents.allPartsLoaded.publish(partOptions.lang);
            }
        }

        function languageChangedCallback() {
            self.parts.loadedCounter = 0;
        }

        function preloadCallback() {
            if (!self.options.preloadLanguages) return;

            for (var i = 0; i < self.options.preloadLanguages.length; i++) {
                var lang = self.options.preloadLanguages[i];

                loadParts(lang);
            }
        }
    };
})();