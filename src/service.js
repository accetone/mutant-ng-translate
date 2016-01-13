(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translate', ['$translateUtils', '$translateStorageSvc', '$translateLoaderSvc', '$translateUtils', translate]);

    function translate($tranlslateUtils, $storage, $loader, $utils) {
        var self = this;

        self.options = {
            dataTransformation: $tranlslateUtils.directDataTransformation,
            cache: {
                translations: true,
                lang: true
            },
            preload: {
                enabled: false,
                langs: [],
                delay: 0
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
            angular.merge(self.options, options);
            self.validateOptions(self.options);

            $storage.config(self.options);
            $loader.config(self.options, $storage.setTranslations);
        }

        function validateOptions(options) {
            // default lang
            if (!options.defaultLang) {
                $utils.error.throw('you didn\'t specify default language');
            }

            if (typeof options.defaultLang !== 'string') {
                $utils.error.throw('incorrect value for default language');
            }

            // url template
            if (!options.urlTemplate) {
                $utils.error.throw('you didn\'t specify url template');
            }

            if (typeof options.urlTemplate !== 'string') {
                $utils.error.throw('incorrect value url template');
            }

            if (options.urlTemplate.indexOf('{lang}') === -1) {
                $utils.error.throw('url template should contain at least {lang} expression');
            }

            // data transformation
            if (typeof options.dataTransformation !== 'function') {
                $utils.error.throw('incorrect value for data transformation');
            }

            // cache
            if (typeof options.cache !== 'object') {
                $utils.error.throw('incorrect value for cache');
            }

            if (typeof options.cache.translations !== 'boolean') {
                $utils.error.throw('incorrect value for cache translations');
            }

            if (typeof options.cache.lang !== 'boolean') {
                $utils.error.throw('incorrect value for cache language');
            }

            // preload
            if (typeof options.preload !== 'object') {
                $utils.error.throw('incorrect value for preload');
            }

            if (typeof options.preload.enabled !== 'boolean') {
                $utils.error.throw('incorrect value for preload enabled');
            }

            if (Object.prototype.toString.call(options.preload.langs) !== '[object Array]') {
                $utils.error.throw('incorrect value for preload langs');
            }

            if (typeof options.preload.delay !== 'number') {
                $utils.error.throw('incorrect value for preload delay');
            }
        }

        /* LANGS */
        function use(lang) {
            if ($storage.getLang() === lang) return;

            $storage.setLang(lang);
            $loader.loadParts(lang, false);
        }

        function currentLang() {
            return $storage.getLang();
        }

        /* TRANSLATIONS */
        function translations(lang, values) {
            if (!lang) {
                lang = $storage.getLang();
            }

            if (!!values) {
                $storage.setTranslations(lang, values);
            }

            return $storage.getTranslations(lang);
        }

        function translation(key) {
            var lang = $storage.getLang();

            return $storage.getTranslation(lang, key);
        } 

        /* PARTS */
        function addParts() {
            var lang = $storage.getLang();

            $loader.addParts(arguments, lang);
        }

        function addPart(name) {
            // TODO: add is string validation 
            var lang = $storage.getLang();

            $loader.addPart(name, lang);
        }

        function refresh(force) {
            var lang = $storage.getLang();

            $loader.loadParts(lang, force);
        }
    };
})();