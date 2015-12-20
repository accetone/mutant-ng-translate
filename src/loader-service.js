(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateLoaderSvc', ['$translateLoader', '$translateEvents', translateLoaderSvc]);

    function translateLoaderSvc($translateLoader, $translateEvents) {
        var self = this;

        self.config = config;
        self.options = undefined;

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
        function config(options) {
            self.options = options;

            if (self.options.preload.enabled) {
                $translateEvents.allPartsLoaded.subscribe(self.preload, true);
            }
        }

        /* PARTS */
        function addParts(names, lang, storageCallback) {
            for (var i = 0; i < names.length; i++) {
                self.addPart(names[i], lang, storageCallback);
            }
        }

        function addPart(name, lang, storageCallback) {
            // TODO: check if part with this name already added
            if (!name) return;

            var part = { name: name };
            self.parts.push(part);

            self.loadPart(part, lang, storageCallback);
        }
        
        function loadParts(lang, storageCallback, force) {
            if (force) {
                self.sync.resetCounter(lang);
            }

            for (var i = 0; i < self.parts.length; i++) {
                if (!force && !self.sync.needLoad(self.parts[i], lang, storageCallback)) continue;

                self.loadPart(self.parts[i], lang, storageCallback);
            }
        }

        function loadPart(part, lang, storageCallback) {
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

                    storageCallback(lang, values);

                    $translateEvents.partLoaded.publish(partOptions);
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

            $translateEvents.allPartsLoaded.publish(lang);
        }

        function needLoad(part, lang) {
            return !isLoading(part, lang) && !isLoaded(part, lang);
        }

        /* PRELOAD */
        function preload() {
            if (!self.options.preload.langs) return;

            for (var i = 0; i < self.options.preload.langs.length; i++) {
                var lang = self.options.preload.langs[i];

                self.loadParts(lang);
            }
        }
    }
})();