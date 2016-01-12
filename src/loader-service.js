(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateLoaderSvc', ['$timeout', '$translateLoader', '$translateEvents', translateLoaderSvc]);

    function translateLoaderSvc($timeout, $translateLoader, $translateEvents) {
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
        function config(options, storageCallback) {
            self.options = options;
            self.storageCallback = storageCallback;

            if (self.options.preload.enabled) {
                $translateEvents.allPartsLoaded.subscribe(self.preload, true);
            }
        }

        /* PARTS */
        function addParts(names, lang) {
            for (var i = 0; i < names.length; i++) {
                self.addPart(names[i], lang);
            }
        }

        function addPart(name, lang) {
            // TODO: check if part with this name already added
            var part = { name: name };
            self.parts.push(part);

            self.loadPart(part, lang);
        }
        
        function loadParts(lang, force) {
            if (force) {
                self.sync.resetCounter(lang);
            }

            for (var i = 0; i < self.parts.length; i++) {
                if (!force && !self.sync.needLoad(self.parts[i], lang)) continue;

                self.loadPart(self.parts[i], lang);
            }
        }

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
        function loadingOn(part, lang) {
            self.sync.loading[lang + '.' + part.name] = true;
        }

        function loadingOff(part, lang) {
            self.sync.loading[lang + '.' + part.name] = false;
            self.sync.loaded[lang + '.' + part.name] = true;
        }

        function isLoading(part, lang) {
            return self.sync.loading[lang + '.' + part.name];
        }

        function isLoaded(part, lang) {
            return self.sync.loaded[lang + '.' + part.name];
        }

        function increaseCounter(lang) {
            if (!self.sync.counter[lang]) self.sync.counter[lang] = 1;
            else self.sync.counter[lang]++;
        }

        function resetCounter(lang) {
            self.sync.counter[lang] = 0;
        }

        function checkCounter(lang) {
            if (self.sync.counter[lang] !== self.parts.length) return;

            $translateEvents.allPartsLoaded.publish({ lang: lang });
        }

        function needLoad(part, lang) {
            return !isLoading(part, lang) && !isLoaded(part, lang);
        }

        /* PRELOAD */
        function preload() {
            if (!self.options.preload.langs) return;

            $timeout(function () {
                for (var i = 0; i < self.options.preload.langs.length; i++) {
                    var lang = self.options.preload.langs[i];

                    self.loadParts(lang);
                }
            }, self.options.preload.delay);
        }
    }
})();