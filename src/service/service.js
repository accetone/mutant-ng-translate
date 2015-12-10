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
        self.translations = translations;
        self.use = use;
        self.refresh = refresh;

        self.parts = {
            add: addPart,
            load: loadPart,
            list: []
        };

        self.values = {};
        self.translation = translation;

        return self;

        function config(options) {
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

            // register preload
            $translateEvents.allPartsLoaded.subscribe(preload);
        }

        function translations(lang, values) {
            if (!!values) {
                $translateStorage.setValues(lang, values);
            }

            if (!!lang) return self.values;

            return $translateStorage.getValues(lang);
        }

        function use(lang) {
            if (self.options.lang === lang) return;

            self.options.lang = lang;
            $translateCache.setLang(lang);
            self.values = $translateStorage.getValues(lang);

            var cacheValues = $translateCache.getValues(lang);
            $translateStorage.setValues(lang, cacheValues);

            self.refresh();

            $translateEvents.languageChanged.publish();
        }

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
                    $translateCache.setValues(partOptions.lang, values);

                    if ($translateLoader.loaded[partOptions.lang] === self.parts.list.length) {
                        $translateEvents.allPartsLoaded.publish(partOptions.lang);
                    }
                });
        }

        function translation(key) {
            return $translateStorage.getValue(self.options.lang, key);
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