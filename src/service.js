(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translate', ['$translateUtils', '$translateStorageSvc', '$translateLoaderSvc', translate]);

    function translate($tranlslateUtils, $storage, $loader) {
        var self = this;

        self.options = {
            dataTransformation: $tranlslateUtils.directDataTransformation,
            cache: {
                translations: true,
                lang: true
            },
            preload: {
                enabled: false,
                langs: []
            }
        };
        
        self.config = config;
        self.validateOptions = validateOptions;
     
        self.use = use;
        self.current = currentLang;

        self.translations = translations;
        self.translation = translation;

        self.addPart = addPart;
        self.addParts = addParts;

        self.refresh = refresh;

        return self;
        
        /* INITIALIZATION */
        function config(options) {
            angular.extend(self.options, options);
            self.validateOptions();

            $storage.config(self.options);
            $loader.config(self.options);
        }

        function validateOptions() {
            $tranlslateUtils.validateOptions(self.options);
        }

        /* LANGS */
        function use(lang) {
            if ($storage.getLanguage() === lang) return;

            $storage.setLanguage(lang);
            $loader.loadParts(lang, $storage.setTranslations, false);
        }

        function currentLang() {
            return $storage.getLanguage();
        }

        /* TRANSLATIONS */
        function translations(lang, values) {
            if (!lang) {
                lang = $storage.getLanguage();
            }

            if (!!values) {
                $storage.setTranslations(lang, values);
            }

            return $storage.getTranslations(lang);
        }

        function translation(key) {
            var lang = $storage.getLanguage();

            return $storage.getTranslation(lang, key);
        } 

        /* PARTS */
        function addParts() {
            var lang = $storage.getLanguage();

            $loader.addParts(arguments, lang, $storage.setTranslations);
        }

        function addPart(name) {
            var lang = $storage.getLanguage();

            $loader.addPart(name, lang, $storage.setTranslations);
        }

        function refresh(force) {
            var lang = $storage.getLanguage();

            $loader.loadParts(lang, $storage.setTranslations, force);
        }
    };
})();