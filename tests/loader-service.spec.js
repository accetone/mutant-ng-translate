'use strict';

describe('The translate loader service test suite', function () {
    var $loaderService, $storageService, options;

    beforeEach(function () {
        module('mutant-ng-translate');

        inject(function ($translateLoaderSvc, $translateStorageSvc) {
            $loaderService = $translateLoaderSvc;
            $storageService = $translateStorageSvc;
        });

        options = {
            defaultLang: 'en',
            urlTemplate: '/locale-{part}-{lang}.json',
            cache: {
                translations: true,
                lang: true
            },
            dataTransformation: function (x) {
                return x;
            },
            preload: {
                enabled: true,
                langs: [],
                delay: 0
            }
        };

        $storageService.config(options);
        $loaderService.config(options, $storageService.setTranslations);
    });

    describe('>> Common tests', function () {
        it('should be defined', function () {
            expect($loaderService).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $loaderService).toBe('object');
        });
    });

    describe('>> Config tests', function () {
        it('should save options and storage callback', function() {
            expect($loaderService.options).toEqual(options);
            expect($loaderService.storageCallback).toEqual($storageService.setTranslations);
        });

        it('should sync options', function () {
            options.preload.delay = 2000;

            expect($loaderService.options.preload.delay).toEqual(2000);
        });
    });

});