(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translate', ['$translateStorageSvc', '$translateLoaderSvc', '$translateUtils', translate]);

    /**
     * @ngdoc service
     * @name translate.$translate
     * @requires translate.storageService
     * @requires translate.loaderService
     * @requires translate.utils
     * 
     * @description 
     * Service responsible for comunication with external code and manage other parts to work mutually
     */
    function translate($storage, $loader, $utils) {
        var self = this;

        self.options = {
            dataTransformation: $utils.directDataTransformation,
            keyResolver: $utils.directKeyResolver,
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
        self.current = current;

        self.translations = translations;
        self.translation = translation;

        self.addPart = addPart;
        self.addParts = addParts;

        self.refresh = refresh;

        return self;
        
        /* INITIALIZATION */
        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name config
         * 
         * @param {Object} options Options
         * 
         * @description 
         * Merge external options with default library options. 
         * Initialize {@link translate.storageService storageService} and {@link translate.loaderService loaderService}
         */
        function config(options) {
            angular.merge(self.options, options);
            self.validateOptions(self.options);

            $storage.config(self.options);
            $loader.config(self.options, $storage.setTranslations);
        }

        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name validateOptions
         * 
         * @param {Object} options Options
         * 
         * @description 
         * Throw error if options are corrupt
         */
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
        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name use
         * 
         * @param {string} lang Language
         * 
         * @description 
         * Set current language to given and start loading parts for it.
         * Do nothing if passed language equal to current
         */
        function use(lang) {
            if (typeof lang !== 'string') {
                $utils.error.throw('incorrect value for lang to use');
            }

            if ($storage.getLang() === lang) return;

            $storage.setLang(lang);
            $loader.loadParts(lang, false);
        }

        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name current
         * 
         * @returns {string} Language 
         * 
         * @description 
         * Return current language
         */
        function current() {
            return $storage.getLang();
        }

        /* TRANSLATIONS */
        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name translations
         * 
         * @returns {Object<string, string>} Translations Hashmap 
         * 
         * @description 
         * Return translation hashmap for current language
         */

        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name translations
         * 
         * @param {string} lang Language
         * @returns {Object<string, string>} Translations Hashmap 
         * 
         * @description 
         * Return translation hashmap for given language
         */

        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name translations
         * 
         * @param {string} lang Language
         * @param {Object<string, string>} values Translations Hashmap
         * @returns {Object<string, string>} Updated Translations Hashmap 
         * 
         * @description 
         * Put given translations hashmap to storage service for given language.
         * After that return updated translations hashmap for given language
         */
        function translations(lang, values) {
            if (!lang) {
                lang = $storage.getLang();
            }

            if (!!values) {
                $storage.setTranslations(lang, values);
            }

            return $storage.getTranslations(lang);
        }

        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name translation
         * 
         * @param {string} key Translation Key
         * @returns {string} Translation
         * 
         * @description 
         * Return translation for current language and given translation key
         */
        function translation(key) {
            var lang = $storage.getLang();

            return $storage.getTranslation(lang, key);
        } 

        /* PARTS */
        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name addParts
         * 
         * @param {string} name1 Part Name 1
         * @param {string} [name2] Part Name 2
         * @param {string} [...] ...
         * 
         * @description 
         * Add parts for current language.
         * Loading will start automatically.
         * Pass part names as separate params
         */
        function addParts() {
            var lang = $storage.getLang();

            $loader.addParts(arguments, lang);
        }

        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name addPart
         * 
         * @param {string} name Part Name
         * 
         * @description 
         * Add part for current language.
         * Loading will start automatically
         */
        function addPart(name) {
            var lang = $storage.getLang();

            $loader.addPart(name, lang);
        }

        /**
         * @ngdoc method
         * @methodOf translate.$translate
         * @name refresh
         * 
         * @param {boolean} force Force
         * 
         * @description 
         * Call force reload of all added parts for current language
         */
        function refresh(force) {
            var lang = $storage.getLang();

            $loader.loadParts(lang, force);
        }
    }
})();