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
    });

});