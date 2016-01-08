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

    describe('Translations get/set tests >>', function () {
        beforeEach(function() {
            $service.config(options);
        });
        
        // get
        it('should return empty object if called without params', function () {
            var translations = $service.getTranslations();

            expect(translations).toEqual({});
        });

        it('should return empty object if values for lang isn\'t available', function () {
            $service.setTranslations(en.lang, en.values);
            var translations = $service.getTranslations(ru.lang);

            expect(translations).toEqual({});
        });

        it('should return values from storage', function () {
            $storage.setValues(en.lang, en.values);

            var translations = $service.getTranslations(en.lang);
            var values = $storage.getValues(en.lang);

            expect(translations).toEqual(values);
        });

        it('should not return values from cache', function () {
            $cache.setValues(en.lang, en.values);

            var translations = $service.getTranslations(en.lang);
            var values = $cache.getValues(en.lang);

            expect(translations).not.toEqual(values);
        });

        it('should return undefined if called without params or without key', function () {
            $service.setTranslations(en.lang, en.values);

            var value1 = $service.getTranslation();
            var value2 = $service.getTranslation(en.lang);

            expect(value1).toEqual(undefined);
            expect(value2).toEqual(undefined);
        });

        it('should return value if key exist', function () {
            $service.setTranslations(en.lang, en.values);

            var value = $service.getTranslation(en.lang, en.key);

            expect(value).toEqual(en.values[en.key]);
        });

        it('should return key if key not exist', function () {
            $service.setTranslations(en.lang, en.values);

            var value = $service.getTranslation(en.lang, en.notExistKey);

            expect(value).toEqual(en.notExistKey);
        });

        // set
        it('should not modify values if called without params', function () {
            $service.setTranslations();

            var storageValues = $storage.getValues(en.lang);
            var cacheValues = $cache.getValues(en.lang);

            expect(storageValues).toEqual({});
            expect(cacheValues).toEqual({});

            $service.setTranslations(en.lang, en.values);
            $service.setTranslations();

            storageValues = $storage.getValues(en.lang);
            cacheValues = $cache.getValues(en.lang);

            expect(storageValues).toEqual(en.values);
            expect(cacheValues).toEqual(en.values);
        });

        it('should write values both to storage and cache', function () {
            $service.setTranslations(en.lang, en.values);

            var storageValues = $storage.getValues(en.lang);
            var cacheValues = $cache.getValues(en.lang);

            expect(storageValues).toEqual(en.values);
            expect(cacheValues).toEqual(en.values);
        });

        it('should write merged values both to storage and cache', function () {
            $service.setTranslations(en.lang, en.values);
            $service.setTranslations(en.lang, en.moreValues);

            var storageValues = $storage.getValues(en.lang);
            var cacheValues = $cache.getValues(en.lang);

            expect(storageValues).toEqual(en.mergedValues);
            expect(cacheValues).toEqual(en.mergedValues);
        });

        it('should write values only to storage', function () {
            options.cache.translations = false;

            $service.setTranslations(en.lang, en.values);

            var storageValues = $storage.getValues(en.lang);
            var cacheValues = $cache.getValues(en.lang);

            expect(storageValues).toEqual(en.values);
            expect(cacheValues).toEqual({});
        });
    });

    describe('Lang get/set tests >>', function () {
        beforeEach(function () {
            $service.config(options);
        });

        it('should return set lang', function () {
            $service.setLang(en.lang);
            var lang = $service.getLang();

            expect(lang).toEqual(en.lang);
        });

        it('should write lang both to options and cache', function () {
            $service.setLang(en.lang);

            var optionsLang = $service.options.lang;
            var cachedLang = $cache.getLang();

            expect(optionsLang).toEqual(en.lang);
            expect(cachedLang).toEqual(en.lang);
        });

        it('should write lang only to options', function () {
            options.cache.lang = false;

            $service.setLang(en.lang);

            var optionsLang = $service.options.lang;
            var cachedLang = $cache.getLang();

            expect(optionsLang).toEqual(en.lang);
            expect(cachedLang).toEqual(undefined);
        });

        it('should load translations for passed lang from cache', function () {
            $cache.setValues(ru.lang, ru.values);
            $service.setLang(ru.lang);

            var translations = $service.getTranslations(ru.lang);

            expect(translations).toEqual(ru.values);
        });

        it('should not load translations for passed lang from cache', function () {
            options.cache.translations = false;

            $cache.setValues(ru.lang, ru.values);
            $service.setLang(ru.lang);

            var translations = $service.getTranslations(ru.lang);

            expect(translations).toEqual({});
        });
    });

    describe('Events tests >>', function () {
        var callback;

        beforeEach(function () {
            $service.config(options);
            callback = jasmine.createSpy('callback');
        });

        it('should generate translations updated event when set them', function () {
            $events.translationsUpdated.subscribe(callback);

            $service.setTranslations(en.lang, en.values);

            expect(callback.calls.count()).toBe(1);
            expect(callback.calls.argsFor(0)).toEqual([{ lang: en.lang }]);
        });

        it('should generate lang chenage event when set it', function () {
            $events.langChanged.subscribe(callback);

            $service.setLang(ru.lang);

            expect(callback.calls.count()).toBe(1);
            expect(callback.calls.argsFor(0)).toEqual([{ from: en.lang, to: ru.lang }]);
        });
    });
});