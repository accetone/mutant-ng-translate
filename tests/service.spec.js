'use strict';

describe('The translate service test suite', function () {
    var $translate, $storageService, $loaderService, $utils, options, mergedOptions;

    beforeEach(function () {
        module('mutant-ng-translate');

        window.localStorage.clear();

        inject(function (_$translate_, $translateStorageSvc, $translateLoaderSvc, $translateUtils) {
            $translate = _$translate_;
            $storageService = $translateStorageSvc;
            $loaderService = $translateLoaderSvc;
            $utils = $translateUtils;
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
});