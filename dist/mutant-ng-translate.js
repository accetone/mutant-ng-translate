(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name translate
     * 
     * @description 
     * # MUTANT-NG-TRANSLATE 
     * ## General 
     * 
     * Internationalization library for Angular applications.  
     * 
     * For quick start look to official {@link https://github.com/accetone/mutant-ng-translate readme file}.  
     * Also you can find simple demo {@link http://accetone.github.io/mutant-ng-translate-docs/demo/ here}.  
     * 
     * **Our key features**
     * - native parts mechanism: load your locale files using complex url templates like `/locale-{part}-{lang}.json`  
     * - parallel asynchronous loading: translations from part will be available and showed as soon as loaded  
     * - built-in caching of loaded translations and choosed language using browser localstorage, 
     * so next time user will see translations imidiatelly  
     * - configurable preload that load languages after primary language loaded,
     * so you can make switch of language more gentle
     * - support of angular 1.4.x and higher  
     * 
     * ## Config options
     * 
     * **Required options**  
     * 
     * Url template and default language are only required.
     * Other options are optional.
     * 
     * ```javascript
     * $translate.config({
     *      defaultLang: 'en',
     *      urlTemplate: '/locale-{part}-{lang}.json'
     * });
     * ```
     * 
     * **One file per language**
     * 
     * Url template should contain at least `{lang}` pattern. 
     * So if you have only one file per language, you can specify required template.
     * 
     * ```javascript
     * $translate.config({
     *      defaultLang: 'en',
     *      urlTemplate: '/locale/{lang}.json'
     * });
     * 
     * $translate.addPart('');
     * ```
     * 
     * **Complex JSON file**
     *
     * If your locale file not plain key-value file, you can use built-in `complexDataTransformation` or pass your
     * own `dataTransformation` function with options.
     *
     * In case you want to use built-in function, see how it works {@link translate.utils here} (see `complexDataTransformation`).
     * 
     * Your own should transfrom you data to plain key-value object (hashmap).
     * You can find signature {@link translate.utils here} (see `directDataTransformation`).
     * 
     * ```javascript
     * $translate.config({
     *      ...
     *      dataTranformation: funciton (data) {
     *          return data.translations;       
     *      }
     * });
     * ```
     * 
     * **Custom non existing translations**
     * 
     * By default you will see `key` if translation for this `key` not exist for current language.
     * If you want to change this behaviour you can pass `keyResolver` function with options.
     * This function should receive `key` and return default translation.
     * You can find signature {@link translate.utils here} (see `directKeyResolver`). 
     * 
     * ```javascript
     * $translate.config({
     *      ...
     *      keyResolver: funciton (key) {
     *          return '';     
     *      }
     * });
     * ```
     * 
     * **Disable cache**
     * 
     * If you want to disable cache of translations or preferred language in client localstorage
     * you can pass `cache` object with options.
     * 
     * ```javascript
     * $translate.config({
     *      ...
     *      cache: {          
     *          lang: false,
     * 
     *          // not required to write, default value already true
     *          translations: true
     *      }
     * });
     * ```
     * 
     * **Preload**
     * 
     * You can pass list of languages that will be loaded after first language 
     * (in most times it would be default or preferred). 
     * This feature can make swithing of languages more smooth.
     * Don't worry, already loaded languages will not load twice.
     * 
     * ```javascript
     * $translate.config({
     *      ...
     *      preload: {
     *          langs: ['en', 'fr', 'de']
     *      }
     * });
     * ```
     * 
     * Also you can configure preload delay - 
     * time after first language loaded and start loading preload languages.
     * 
     * ```javascript
     * $translate.config({
     *      ...
     *      preload: {
     *          langs: ['en', 'fr', 'de'],
     * 
     *          // in milliseconds
     *          delay: 10000
     *      }
     * });
     * ```
     * 
     * **Events**  
     * 
     * If you want you can subscribe to library events.
     * More information you can find {@link translate.events here}
     * 
     */
    angular
        .module('mutant-ng-translate', []);
})();

(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateCache', ['$window', translateCache]);

    /**
     * @ngdoc service
     * @name translate.cache
     * @requires $window
     * 
     * @description 
     * Service responsible for caching the translations data and prefered language in local storage, if it supported by browser
     */
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
        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name isSupportLocalStorage
         * 
         * @returns {boolean} Is Support
         * 
         * @description 
         * Check if browser support localstorage
         */
        function isSupportLocalStorage() {
            try {
                $window.localStorage.setItem('test', 'test');
                $window.localStorage.removeItem('test');

                return true;
            } catch (exception) {
                return false;
            }
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name getFromLocalStorage
         * 
         * @param {string} key Key
         * @returns {Object | string} Value
         * 
         * @description 
         * Get value by given key from local storage
         */
        function getFromLocalStorage(key) {
            if (!self.local.storage[key]) return undefined;
            return JSON.parse(self.local.storage[key]);
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name putToLocalStorage
         * 
         * @param {string} key Key
         * @param {Object | string} obj Object
         * 
         * @description 
         * Put value into local storage by given key
         */
        function putToLocalStorage(key, obj) {
            self.local.storage[key] = JSON.stringify(obj);
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name existsInLocalStorage
         * 
         * @param {string} key Key
         * @returns {boolean} Is Exists
         * 
         * @description 
         * Check if given key exists in local storage
         */
        function existsInLocalStorage(key) {
            return !!self.local.storage[key];
        }

        // CACHE
        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name getValuesFromCache
         * 
         * @param {string} lang Language
         * @returns {Object<string, string>} Values Hashmap
         * 
         * @description 
         * Return values hashmap from local storage for given language.
         * If local storage not supported or hashmap for given language not exists will return empty object
         */
        function getValuesFromCache(lang) {
            if (!self.local.isSupported) return {};

            var lsKey = self.local.prefix + lang;

            if (!self.local.exists(lsKey)) {
                self.local.put(lsKey, {});
            }

            return self.local.get(lsKey);
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name setValuesToCache
         * 
         * @param {string} lang Language
         * @param {Object<string, string>} values Values Hashmap
         * 
         * @description 
         * Merge local storage hashmap for given language with passed hashmap and put result to local storage.
         * If local storage not supported will do nothing
         */
        function setValuesToCache(lang, values) {
            if (!self.local.isSupported) return;

            var lsKey = self.local.prefix + lang;
            var cacheValues = self.cache.getValues(lang);

            angular.merge(cacheValues, values);

            self.local.put(lsKey, cacheValues);
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name getLangFromCache
         * 
         * @returns {string | undefined} Language
         * 
         * @description 
         * Return langugage from local storage.
         * If local storage not supported or language not exists in local storage will return undefined
         */
        function getLangFromCache() {
            if (!self.local.isSupported) return undefined;

            var lsKey = self.local.prefix + 'lang';

            return self.local.get(lsKey);
        }

        /**
         * @ngdoc method
         * @methodOf translate.cache
         * @name setLangToCache
         * 
         * @param {string} lang Language
         * 
         * @description 
         * Put language to local storage.
         * If local storage not supported will do nothing
         */
        function setLangToCache(lang) {
            if (!self.local.isSupported) return;

            var lsKey = self.local.prefix + 'lang';

            self.local.put(lsKey, lang);
        }
    };
})();
(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .directive('ngTranslate', ['$translate', '$translateEvents', translateDirective]);

    /**
     * @ngdoc directive
     * @name translate.directive:ngTranslate
     * @restrict 'A'
     * @element ANY
     * @requires translate.$translate
     * @requires translate.events
     * 
     * @param {string} ngTranslate Translation key
     * 
     * @description 
     * Transform any html element to the translation container. 
     * Translations get from {@link translate.$translate $translate} service by specified key
     */
    function translateDirective($translate, $translateEvents) {
        var link = function (scope, element, attrs) {
            element = element[0];

            var translitionKey = attrs['ngTranslate'];

            var update = function() {
                element.innerHTML = $translate.translation(translitionKey);
            };

            $translateEvents.translationsUpdated.subscribe(update);
            $translateEvents.langChanged.subscribe(update);

            element.innerHTML = $translate.translation(translitionKey);
        };

        return {
            restrict: 'A',
            link: link
        };
    };
})();
(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateEvents', ['$translateUtils', translateEvents]);

    /**
     * @ngdoc service
     * @name translate.events
     * @requires translate.utils
     * 
     * @description 
     * Service responsible for providing access to library events. 
     * Provide list of event objects and you can subscribe to each (see implementation {@link translate.event here}). 
     * 
     * @example
     * ```javascript
     * var callback = function (data) { console.log(data); }
     * 
     * // how subscribe ?
     * var token = $translateEvents.langChanged.subscribe(callback);
     * 
     * // how unsibscribe ?
     * token.unsibscribe();
     * 
     * // how to register one-time callback ?
     * var token2 = $translateEvents.langChanged.subscribe(callback, true);
     * ```
     */
    function translateEvents($utils) {
        var self = this;

        /**
         * @ngdoc event
         * @eventOf translate.events
         * @name partLoaded
         * 
         * @param {string} data { part: partname, lang: language key }
         * 
         * @description 
         * Fires when any part for any language loaded
         */
        self.partLoaded = new event($utils);

        /**
         * @ngdoc event
         * @eventOf translate.events
         * @name allPartsLoaded
         * 
         * @param {string} data { lang: language key }
         * 
         * @description 
         * Fires when all registered parts for some language loaded
         */
        self.allPartsLoaded = new event($utils);

        /**
         * @ngdoc event
         * @eventOf translate.events
         * @name translationsUpdated
         * 
         * @param {string} data { lang: language key }
         * 
         * @description 
         * Fires when translations for any language updated
         */
        self.translationsUpdated = new event($utils);

        /**
         * @ngdoc event
         * @eventOf translate.events
         * @name langChanged
         * 
         * @param {string} data { from: old language key, to: new language key }
         * 
         * @description 
         * Fires when language changed
         */
        self.langChanged = new event($utils);

        return self;
    }

    /**
     * @ngdoc object
     * @name translate.event
     * @requires translate.utils
     * 
     * @description
     * Used to create event objects in {@link translate.events}
     */
    function event($utils) {
        var self = this;
       
        self.subscribers = [];
        self.subscribe = subscribe;
        self.once = once;
        self.unsubscribe = unsubscribe;
        self.publish = publish;

        self.id = 0;
        self.generateId = generateId;

        return {
            subscribe: self.subscribe,
            once: self.once,
            publish: self.publish
        };

        /**
         * @ngdoc method
         * @methodOf translate.event
         * @name subscribe
         * 
         * @param {function} callback Event callback
         * @param {boolean} [disposable] Disposable
         * @returns {Object} Subscribtion Token
         * 
         * @description 
         * Put callback to subscribers list. 
         * Return subscription token, so subscriber can unsubscribe.
         * Disposable subscription mean automatical unsubscribe after one call
         */
        function subscribe(callback, disposable) {
            if (callback == undefined) {
                $utils.error.throw('callback must be defined to subscribe for an event');
            } else if (typeof callback !== 'function') {
                $utils.error.throw('callback must be a function to subscribe for an event');
            }

            var subscriber = {
                id: self.generateId(),
                callback: disposable 
                    ? function() {
                        subscriber.unsubscribe();
                        callback();
                    } 
                    : callback,
                unsubscribe: self.unsubscribe
            };

            self.subscribers.push(subscriber);

            return subscriber;
        }

        /**
         * @ngdoc method
         * @methodOf translate.event
         * @name once
         *
         * @param {function} callback Event callback
         * @returns {Object} Subscribtion Token
         *
         * @description
         * Put callback to subscribers list with automatical unsubscribe after one call (short-hand for subscribe(callback, true)).
         * Return subscription token, so subscriber can unsubscribe.
         */
        function once(callback) {
            return subscribe(callback, true);
        }

        /**
         * @ngdoc method
         * @methodOf translate.event
         * @name unsubscribe
         * 
         * @returns {boolean} Is Success
         * 
         * @description 
         * Delete subscriber from subscribtion list
         */
        function unsubscribe() {
            var index = self.subscribers.indexOf(this);
            if (index === -1) return false;

            self.subscribers.splice(index, 1);
            return true;
        }

        /**
         * @ngdoc method
         * @methodOf translate.event
         * @name publish
         * 
         * @param {Object} data Data
         * 
         * @description 
         * Call all registered callbacks and pass given data to them
         */
        function publish(data) {
            var subscribers = self.subscribers.slice();

            for (var i = 0; i < subscribers.length; i++) {
                subscribers[i].callback(data);
            }
        }

        /**
         * @ngdoc method
         * @methodOf translate.event
         * @name generateId
         * 
         * @returns {number} Id
         * 
         * @description 
         * Generate unique subscribtion id (unique within specific event object)
         */
        function generateId() {
            return self.id++;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .filter('translate', ['$translate', translateFilter]);

    /**
     * @ngdoc filter
     * @name translate.filter:translate
     * @function
     * @requires translate.$translate
     * 
     * @param {string} translate_expression Translation key
     * 
     * @description 
     * Transform translation key into translation
     */
    function translateFilter($translate) {
        var filter = function(key) {
            return $translate.translation(key);
        };

        filter.$stateful = true;

        return filter;
    };
})();
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
(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateLoader', ['$http', '$q', translateLoader]);

    /**
     * @ngdoc service
     * @name translate.loader
     * @requires $http
     * @requires $q
     * 
     * @description 
     * Service responsible for loading parts
     */
    function translateLoader($http, $q) {
        var self = this;

        self.loadPart = loadPart;

        return self;

        /**
         * @ngdoc method
         * @methodOf translate.loader
         * @name loadPart
         * 
         * @param {Object} options Options
         * @returns {Promise} Loading Promise
         * 
         * @description 
         * Start part loading with given options and return promise.
         * Promise will be resolved after loading complete.
         * Transform received from server data with data transformation function.
         * Transformed data will be passed with promise resolve.
         */
        function loadPart(options) {
            var url = options
                .urlTemplate
                .replace(/{part}/g, options.part.name)
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
})();
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
                enabled: true,
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
(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateStorage', [translateStorage]);

    /**
     * @ngdoc service
     * @name translate.storage
     * 
     * @description 
     * Service responsible for storing the translations data while app is running
     */
    function translateStorage() {
        var self = this;

        self.langs = {};

        self.getValues = getValues;
        self.getValue = getValue;
        self.setValues = setValues;

        self.exists = exists;

        return self;

        /**
         * @ngdoc method
         * @methodOf translate.storage
         * @name getValues
         * 
         * @param {string} lang Language
         * @returns {Object.<string, string>} Values Hashmap
         * 
         * @description 
         * Return values hashmap for given language
         */
        function getValues(lang) {
            if (!self.exists(lang)) {
                self.langs[lang] = {};
            }

            return self.langs[lang];
        }

        /**
         * @ngdoc method
         * @methodOf translate.storage
         * @name getValue
         * 
         * @param {string} lang Language
         * @param {string} key Key
         * @returns {string} Value
         * 
         * @description 
         * Return value by key from language hashmap
         */
        function getValue(lang, key, resolver) {
            if (!self.exists(lang, key)) {
                if (typeof resolver === 'function') {
                    return resolver(key);
                } else {
                    return key;
                }
            }

            return self.langs[lang][key];
        }

        /**
         * @ngdoc method
         * @methodOf translate.storage
         * @name setValues
         * 
         * @param {string} lang Language
         * @param {Object.<string, string>} values Values Hashmap
         * 
         * @description 
         * Merge existing hashmap for given language with passed hashmap. 
         * If hashmap not exists, will create empty object first
         */
        function setValues(lang, values) {
            if (!self.langs.hasOwnProperty(lang)) {
                self.langs[lang] = {};
            }

            angular.merge(self.langs[lang], values);
        }

        /**
         * @ngdoc method
         * @methodOf translate.storage
         * @name exists
         * 
         * @param {string} lang Language
         * @param {string} key Key
         * @returns {boolean} Is Exists
         * 
         * @description 
         * Check if key exists in language hashmap 
         */
        function exists(lang, key) {
            if (!self.langs.hasOwnProperty(lang)) return false;

            if (!!key && !self.langs[lang].hasOwnProperty(key)) return false;

            return true;
        }
    };
})();
(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateUtils', [tranlslateUtils]);

    /**
     * @ngdoc service
     * @name translate.utils
     * 
     * @description 
     * Service provides some utility functions like errors, warnings and etc.
     */
    function tranlslateUtils() {
        var self = this;

        /**
         * @ngdoc method
         * @methodOf translate.utils
         * @name directDataTransformation
         * 
         * @param {Object} data Data
         * @returns {Object} Transformed Values
         * 
         * @description 
         * Return passed values without changes. 
         * Used for default transformation of received translations data
         */
        self.directDataTransformation = function (data) {
            return data;
        };

        /**
         * @ngdoc method
         * @methodOf translate.utils
         * @name complexDataTransformation
         *
         * @param {Object} data Data
         * @returns {Object} Transformed Values
         *
         * @description
         * Transfrom complex object to flat object.
         * Translations will be available via '.' (see example)
         *
         * @example
         * ```javascript
         * $translate.config({
         *      ...
         *      dataTranformation: $translateUtils.complexDataTransformation
         * });
         * ```
         *
         * Input:
         * ```json
         * {
         *   "title": "Translator",
         *   "dashboard": {
         *     "hello": "Hallo!",
         *     "menu": {
         *       "main": "Home"
         *     }
         *   }
         * }
         * ```
         *
         * Output:
         * ```json
         * {
         *   "title": "Translator",
         *   "dashboard.hello": "Hallo!",
         *   "dasboard.menu.main": "Home"
         * }
         * ```
         */
        self.complexDataTransformation = function (data) {
            if (data == undefined) return;

            return flattenObject(data, '');

            function flattenObject(obj, prefix) {
                var flat = {};

                for (var p in obj) {
                    if (!obj.hasOwnProperty(p)) continue;



                    if (typeof obj[p] === 'string') {
                        flat[prefix + p] = obj[p]
                    }
                    else {

                        angular.merge(flat, flattenObject(obj[p], prefix + p + '.'));
                    }
                }

                return flat;
            }
        };

        /**
         * @ngdoc method
         * @methodOf translate.utils
         * @name directKeyResolver
         * 
         * @param {string} key Key
         * @returns {string} Value
         * 
         * @description 
         * Return passed key without changes.
         * Used for default key resolving when external code require non existing key
         */
        self.directKeyResolver = function (key) {
            return key;
        };

        /**
         * @ngdoc method
         * @methodOf translate.utils
         * @name errorThrow
         * 
         * @description 
         * Throw error with library prefix
         * 
         * @example 
         * ```javascript
         * $translateUtils.error.throw('error message');
         * ```
         */
        self.error = {
            prefix: '[mutant-ng-translate]: ',
            throw: function (message) {
                throw new Error(self.error.prefix + message);
            }
        };

        /**
         * @ngdoc method
         * @methodOf translate.utils
         * @name warningThrow
         * 
         * @description 
         * Write warning with library prefix
         * 
         * @example 
         * ```javascript
         * $translateUtils.warning.throw('error message');
         * ```
         */
        self.warning = {
            write: console != undefined
                && console.warn != undefined
                && typeof console.warn === 'function'
                ? console.warn
                : function() {},
            throw: function(message) {
                self.warning.write(self.error.prefix + message);
            }
        };

        return self;
    };
})();
//# sourceMappingURL=mutant-ng-translate.js.map
