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
        self.initLanguage = initLanguage;
        self.initTranslations = initTranslations;
        self.initSubscription = initSubscription;

        self.cacheLanguage = cacheLanguage;
        self.cacheTranslations = cacheTranslations;

        self.use = use;
        self.langKey = langKey;

        self.translations = translations;
        self.translation = translation;

        self.parts = {
            add: addPart,
            load: loadPart,
            list: [],
            loaded: {}
        };

        self.preload = {
            callback: preload,
            loaded: {}
        };
        
        self.refresh = refresh;

        return self;
        
        /* INITIALIZATION */
        function config(options) {
            angular.extend(self.options, options);
            self.validateOptions();

            self.initLanguage();
            self.initTranslations();
            self.initSubscription();
        }

        function validateOptions() {
            $tranlslateUtils.validateOptions(self.options);
        }

        function initLanguage() {
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

        function initTranslations() {
            if (!self.options.cacheTranslations) return;

            var cacheValues = $translateCache.getValues(self.options.lang);
            $translateStorage.setValues(self.options.lang, cacheValues);
        }

        function initSubscription() {
            $translateEvents.partLoaded.

            $translateEvents.allPartsLoaded.subscribe(preload, true);
        }

        /* CACHE */
        function cacheLanguage(lang) {
            if (!self.options.cacheSelectedLang) return;

            $translateCache.setLang(lang);
        }

        function cacheTranslations(lang, values) {
            if (!self.options.cacheTranslations) return;

            $translateCache.setValues(lang, values);
        }

        /* LANGS */
        function use(lang) {
            if (self.options.lang === lang) return;

            self.options.lang = lang;

            self.cacheLanguage(lang);
            self.initTranslations();

            self.refresh();

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

            if (!!lang) return $translateStorage.getValues(self.options.lang);

            return $translateStorage.getValues(lang);
        }

        function translation(key) {
            return $translateStorage.getValue(self.options.lang, key);
        }

        /* PARTS */
        // TODO: addParts method
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
                    // TODO: move this two lines to event handlers
                    partOptions.part[partOptions.lang] = true;
                    if (!self.parts.loaded[partOptions.lang]) self.parts.loaded[partOptions.lang] = 1;
                    else self.parts.loaded[partOptions.lang]++;

                    self.cacheTranslations(partOptions.lang, values);
                    $translateCache.setValues(partOptions.lang, values);

                    if (self.parts.loaded[partOptions.lang] === self.parts.list.length) {
                        $translateEvents.allPartsLoaded.publish(partOptions.lang);
                    }
                });
        }

        /* LOADING */

        function refresh() {
            var lang = self.options.lang;

            for (var i = 0; i < self.parts.list.length; i++) {
                if (self.parts.list[i][lang]) continue;

                var partOptions = {
                    part: self.parts.list[i],
                    lang: lang,
                    urlTemplate: self.options.urlTemplate,
                    dataTransformation: self.options.dataTransformation
                };

                self.parts.load(partOptions);
            }
        }

        

        

        
        function preload() {
            if (!self.options.preloadLanguages) return;

            for (var i = 0; i < self.options.preloadLanguages.length; i++) {
                var lang = self.options.preloadLanguages[i];

                for (var j = 0; j < self.parts.list.length; j++) {
                    if (self.parts.list[j][lang]) continue;

                    var partOptions = {
                        part: self.parts.list[j],
                        lang: lang,
                        urlTemplate: self.options.urlTemplate,
                        dataTransformation: self.options.dataTransformation
                    };

                    self.parts.load(partOptions);
                }
            }
        }
    };
})();