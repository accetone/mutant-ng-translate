'use strict';

describe('Translate storage suite >>', function() {
    var $service, $storage, $cache, $events, en, ru, options;

    beforeEach(function () {
        module('mutant-ng-translate');

        window.localStorage.clear();

        inject(function ($translateStorageSvc, $translateStorage, $translateCache, $translateEvents) {
            $service = $translateStorageSvc;
            $storage = $translateStorage;
            $cache = $translateCache;
            $events = $translateEvents;
        });

        en = {
            lang: 'en',
            values: {
                'apple': 'Hello, Apple!',
                'pear': 'Hello, Pear!'
            },
            moreValues: {
                'apple': 'Hello, Apple 2!',
                'peach': 'Hello, Peach!'
            },
            mergedValues: {
                'apple': 'Hello, Apple 2!',
                'pear': 'Hello, Pear!',
                'peach': 'Hello, Peach!'
            },
            key: 'apple',
            notExistKey: 'lime'
        };

        ru = {
            lang: 'ru',
            values: {
                'apple': 'Привет, Яблоко!',
                'pear': 'Привет, Груша!'
            }
        };

        options = {
            defaultLang: 'en',
            cache: {
                translations: true,
                lang: true
            }
        };
    });

    describe('Common tests >>', function () {
        it('should be defined', function () {
            expect($service).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $service).toBe('object');
        });
    });

    describe('Config tests >>', function() {
        it('should init translations and lang with default values if cache not set', function() {
            $service.config(options);

            var lang = $service.getLang();
            var translations = $service.getTranslations(lang);

            expect($service.options).toEqual(options);
            expect(lang).toEqual(options.defaultLang);
            expect(translations).toEqual({});
        });

        describe('With cache >>', function () {
            beforeEach(function() {
                $cache.setLang(ru.lang);
                $cache.setValues(ru.lang, ru.values);
                $cache.setValues(en.lang, en.values);
            });

            it('should init translations and lang with cached values', function () {
                $service.config(options);

                var lang = $service.getLang();
                var translations = $service.getTranslations(lang);

                expect(lang).toEqual(ru.lang);
                expect(translations).toEqual(ru.values);
            });

            it('should init lang with default value if cache disabled', function () {
                options.cache.lang = false;
                $service.config(options);

                var lang = $service.getLang();
                var translations = $service.getTranslations(lang);

                expect(lang).toEqual(options.defaultLang);
                expect(translations).toEqual(en.values);
            });

            it('should init translations with default value if cache disabled', function () {
                options.cache.translations = false;
                $service.config(options);

                var lang = $service.getLang();
                var translations = $service.getTranslations(lang);

                expect(lang).toEqual(ru.lang);
                expect(translations).toEqual({});
            });

            it('should sync options', function() {
                $service.config(options);
                options.cache.translations = false;

                expect($service.options.cache.translations).toEqual(false);
            });
        });
    });

    describe('Translations get/set tests >>', function() {
        it('', function() {

        });
    });
});