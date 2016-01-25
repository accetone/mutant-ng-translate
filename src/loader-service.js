(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateLoaderSvc', ['$timeout', '$translateLoader', '$translateEvents', '$translateUtils', translateLoaderSvc]);

    /**
     * @ngdoc service
     * @name translate.loaderService
     * @requires $timeout
     * @requires translate.loader
     * @requires translate.events
     * @requires translate.utils
     * 
     * @description 
     * Service responsible for managing parts loading process
     */
    function translateLoaderSvc($timeout, $translateLoader, $translateEvents, $translateUtils) {
        var self = this;

        self.config = config;
        self.options = undefined;
        self.storageCallback = undefined;

        self.parts = [];

        self.addParts = addParts;
        self.addPart = addPart;

        self.loadParts = loadParts;
        self.loadPart = loadPart;

        self.sync = {
            counter: {},
            loading: {},
            loaded: {},

            loadingOn: loadingOn,
            loadingOff: loadingOff,
            isLoading: isLoading,
            isLoaded: isLoaded,
            needLoad: needLoad,

            increaseCounter: increaseCounter,
            resetCounter: resetCounter,
            checkCounter: checkCounter
        };

        self.preload = preload;

        return self;

        /* CONFIG */
        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name config
         * 
         * @param {Object} options Options
         * @param {function(string, Object))} storageCallback Storage Callback
         * 
         * @description 
         * Initialize loader service with configuration info:  
         * - options (url template, data transformation function and preload info)  
         * - storage callback (should receive lang and hashmap and put them to storage)  
         *  
         * Always called by {@link translate.$translate $translate} during initialization process 
         */
        function config(options, storageCallback) {
            self.options = options;
            self.storageCallback = storageCallback;

            $translateEvents.allPartsLoaded.subscribe(self.preload, true);
        }

        /* PARTS */
        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name addParts
         * 
         * @param {Array<string>} names Part names
         * @param {string} lang Language
         * 
         * @description 
         * Add parts to list and start loading them for given language
         */
        function addParts(names, lang) {
            for (var i = 0; i < names.length; i++) {
                self.addPart(names[i], lang);
            }
        }

        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name addPart
         * 
         * @param {string} name Part name
         * @param {string} lang Language
         * 
         * @description 
         * Add part to list and start loading it for given language
         */
        function addPart(name, lang) {
            if (typeof name !== 'string') {
                $translateUtils.error.throw('incorrect value for part name');
            }

            var part = { name: name };
            
            for (var i = 0; i < self.parts.length; i++) {
                if (self.parts[i].name === part.name) return;
            }

            if (self.parts.indexOf(part) !== -1) return;

            self.parts.push(part);

            self.loadPart(part, lang);
        }
        
        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name loadParts
         * 
         * @param {string} lang Language
         * @param {boolean} [force] Force 
         * 
         * @description 
         * Start parts loading for given language in non-blocking mode. 
         * Before each part-lang pair start loading check if loading for this pair in progress or it already loaded.
         * In this case loading will be prevented. 
         * If called with force param, will skip this check.
         */
        function loadParts(lang, force) {
            if (force) {
                self.sync.resetCounter(lang);
            }

            for (var i = 0; i < self.parts.length; i++) {
                if (!force && !self.sync.needLoad(self.parts[i], lang)) continue;

                self.loadPart(self.parts[i], lang);
            }
        }

        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name loadPart
         * 
         * @param {Object} part Part
         * @param {string} lang Language
         * 
         * @description 
         * Start loading given part for given language. 
         * After succesful loading will put received data into storage and fire part loaded event.
         * Also call loading syncronization functions.
         */
        function loadPart(part, lang) {
            self.sync.loadingOn(part, lang);

            var partOptions = {
                part: part,
                lang: lang,
                urlTemplate: self.options.urlTemplate,
                dataTransformation: self.options.dataTransformation
            };

            $translateLoader
                .loadPart(partOptions)
                .then(function(values) {
                    self.sync.loadingOff(part, lang);
                    self.sync.increaseCounter(lang);
                    self.sync.checkCounter(lang);

                    self.storageCallback(lang, values);

                    $translateEvents.partLoaded.publish({ part: part.name, lang: lang});
                });
        }

        /* SYNCHRONIZATION */
        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name loadingOn
         * 
         * @param {Object} part Part
         * @param {string} lang Language
         * 
         * @description 
         * Mark given part-lang pair as loading in progress
         */
        function loadingOn(part, lang) {
            self.sync.loading[lang + '.' + part.name] = true;
        }

        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name loadingOff
         * 
         * @param {Object} part Part
         * @param {string} lang Language
         * 
         * @description 
         * Mark given part-lang pair as loaded
         */
        function loadingOff(part, lang) {
            self.sync.loading[lang + '.' + part.name] = false;
            self.sync.loaded[lang + '.' + part.name] = true;
        }
        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name isLoading
         * 
         * @param {Object} part Part
         * @param {string} lang Language
         * @returns {boolean} Is Loading
         * 
         * @description 
         * Return `true` if loading for given part-lang pair in progress
         */
        function isLoading(part, lang) {
            return self.sync.loading[lang + '.' + part.name];
        }

        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name isLoaded
         * 
         * @param {Object} part Part
         * @param {string} lang Language
         * @returns {boolean} Is Loaded 
         * 
         * @description 
         * Return `true` if given part-lang pair already loaded
         */
        function isLoaded(part, lang) {
            return !!self.sync.loaded[lang + '.' + part.name];
        }
        
        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name increaseCounter
         * 
         * @param {string} lang Language
         * 
         * @description 
         * Increase parts loaded counter for given language
         */
        function increaseCounter(lang) {
            if (!self.sync.counter[lang]) self.sync.counter[lang] = 1;
            else self.sync.counter[lang]++;
        }

        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name resetCounter
         * 
         * @param {string} lang Language
         * 
         * @description 
         * Reset parts loaded counter for given language
         */
        function resetCounter(lang) {
            self.sync.counter[lang] = 0;
        }

        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name checkCounter
         * 
         * @param {string} lang Language
         * 
         * @description 
         * Fire all parts loaded event if parts loaded counter for given language equals to parts count
         */
        function checkCounter(lang) {
            if (self.sync.counter[lang] !== self.parts.length) return;

            $translateEvents.allPartsLoaded.publish({ lang: lang });
        }

        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name needLoad
         * 
         * @param {Object} part Part
         * @param {string} lang Language
         * @returns {boolean} Is Load Needed
         * 
         * @description 
         * Check if given part-lang pair require loading. 
         * Return `true` if pair loading not in progress and pair not loaded before
         */
        function needLoad(part, lang) {
            return !isLoading(part, lang) && !isLoaded(part, lang);
        }

        /* PRELOAD */
        /**
         * @ngdoc method
         * @methodOf translate.loaderService
         * @name preload
         * 
         * @description 
         * Start loading parts for languages in preload list after configured delay.
         * Will called when all parts for some language loaded (only one time).
         * Will not cause loading for already loaded part-lang pairs. 
         */
        function preload() {
            if (!self.options.preload.enabled || !self.options.preload.langs) return;

            $timeout(function () {
                for (var i = 0; i < self.options.preload.langs.length; i++) {
                    var lang = self.options.preload.langs[i];

                    self.loadParts(lang);
                }
            }, self.options.preload.delay);
        }
    }
})();