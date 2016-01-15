'use strict';

describe('The translate service test suite', function () {
    var $translate, $storageService, $loaderService, $utils, $httpBackend, options, mergedOptions, en;

    beforeEach(function () {
        module('mutant-ng-translate');

        window.localStorage.clear();

        inject(function (_$translate_, $translateStorageSvc, $translateLoaderSvc, $translateUtils, _$httpBackend_) {
            $translate = _$translate_;
            $storageService = $translateStorageSvc;
            $loaderService = $translateLoaderSvc;
            $utils = $translateUtils;
            $httpBackend = _$httpBackend_;
        });

        options = {
            defaultLang: 'en',
            preload: {
                enabled: true,
                langs: ['en', 'ru'],
                delay: 0
            },
            urlTemplate: '/locale-{part}-{lang}.json'
        };

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

        mergedOptions = {
            dataTransformation: $utils.directDataTransformation,
            cache: {
                translations: true,
                lang: true
            },
            preload: {
                enabled: true,
                langs: ['en', 'ru'],
                delay: 0
            },
            defaultLang: 'en',
            urlTemplate: '/locale-{part}-{lang}.json',
            lang: 'en'
        };
    });

    describe('>> Common tests', function () {
        it('should be defined', function () {
            expect($translate).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $translate).toBe('object');
        });
    });

    describe('>> Config tests', function () {
        it('should merge options with defaults and set lang', function() {
            $translate.config(options);

            expect($translate.options).toEqual(mergedOptions);
        });

        it('should overwrite options default value', function () {
            expect($translate.options.cache.translations).toBe(true);

            options.cache = { translations: false };
            $translate.config(options);
            
            expect($translate.options.cache.translations).toBe(false);
        });

        it('should config loader and storage services', function() {
            $translate.config(options);

            expect($loaderService.options).toEqual($translate.options);
            expect($storageService.options).toEqual($translate.options);
        });
    });

    describe('>> Options validation tests', function () {
        it('should throw error if default lang not specified', function () {
            mergedOptions.defaultLang = undefined;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/you didn\'t specify default language/);
        });

        it('should throw error if default lang not a string', function () {
            mergedOptions.defaultLang = 42;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for default language/);
        });

        it('should throw error if url template not specified', function () {
            mergedOptions.urlTemplate = undefined;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/you didn\'t specify url template/);
        });

        it('should throw error if url template not a string', function () {
            mergedOptions.urlTemplate = 42;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value url template/);
        });

        it('should throw error if url template not contain {lang} expression', function () {
            mergedOptions.urlTemplate = '/get-translations';

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/url template should contain at least {lang} expression/);
        });

        it('should throw error if data transformation is not a function', function () {
            mergedOptions.dataTransformation = undefined;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for data transformation/);

            mergedOptions.dataTransformation = 42;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for data transformation/);
        });

        it('should throw error if cache is not an object', function () {
            mergedOptions.cache = undefined;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for cache/);

            mergedOptions.cache = 42;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for cache/);
        });

        it('should throw error if cache translations is not a boolean', function () {
            mergedOptions.cache.translations = undefined;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for cache translations/);

            mergedOptions.cache.translations = 42;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for cache translations/);
        });

        it('should throw error if cache lang is not a boolean', function () {
            mergedOptions.cache.lang = undefined;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for cache language/);

            mergedOptions.cache.lang = 42;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for cache language/);
        });

        it('should throw error if preload is not an object', function () {
            mergedOptions.preload = undefined;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for preload/);

            mergedOptions.preload = 42;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for preload/);
        });

        it('should throw error if preload enabled is not a boolean', function () {
            mergedOptions.preload.enabled = undefined;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for preload enabled/);

            mergedOptions.preload.enabled = 42;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for preload enabled/);
        });

        it('should throw error if preload langs is not an array', function () {
            mergedOptions.preload.langs = undefined;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for preload langs/);

            mergedOptions.preload.langs = 42;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for preload langs/);
        });

        it('should throw error if preload delay is not a number', function () {
            mergedOptions.preload.delay = undefined;

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for preload delay/);

            mergedOptions.preload.delay = '42';

            expect(function () { $translate.validateOptions(mergedOptions); })
                .toThrowError(/incorrect value for preload delay/);
        });
    });

    describe('>> Langs tests', function () {
        beforeEach(function() {
            $translate.config(options);
            $loaderService.parts.push({ name: 'first' });
            $loaderService.parts.push({ name: 'second' });
        });

        it('should return default lang', function() {
            expect($translate.current()).toBe('en');
        });

        it('should throw error if lang not a string', function () {
            expect(function() { $translate.use(); })
                .toThrowError(/incorrect value for lang to use/);

            expect(function () { $translate.use(42); })
                .toThrowError(/incorrect value for lang to use/);
        });

        it('should change lang', function() {
            $translate.use('ru');

            expect($translate.current()).toBe('ru');
        });

        it('should load parts if called with lang that not equal to current', function() {
            $translate.use('ru');

            $httpBackend.expect('GET', '/locale-first-ru.json').respond({});
            $httpBackend.expect('GET', '/locale-second-ru.json').respond({});
            $httpBackend.flush();

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should not load parts if called with lang that equal to current', function () {
            $translate.use('en');

            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
});