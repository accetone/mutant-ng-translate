'use strict';

describe('The translate loader service test suite', function () {
    var $loaderService, $storageService, $events, options;

    beforeEach(function () {
        module('mutant-ng-translate');

        inject(function ($translateLoaderSvc, $translateStorageSvc, $translateEvents) {
            $loaderService = $translateLoaderSvc;
            $storageService = $translateStorageSvc;
            $events = $translateEvents;
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

    describe('>> Syncronization tests', function () {
        describe('>> Loading', function() {
            it('should return undefined if part for lang not start loading yet', function () {
                var status = $loaderService.sync.isLoading({ name: 'first' }, 'en');

                expect(status).toBeUndefined();
            });

            it('should corretly return loading status', function () {
                $loaderService.sync.loadingOn({ name: 'first' }, 'en');
                var status1 = $loaderService.sync.isLoading({ name: 'first' }, 'en');

                $loaderService.sync.loadingOff({ name: 'first' }, 'en');
                var status2 = $loaderService.sync.isLoading({ name: 'first' }, 'en');

                $loaderService.sync.loadingOn({ name: 'first' }, 'en');
                var status3 = $loaderService.sync.isLoading({ name: 'first' }, 'en');

                $loaderService.sync.loadingOff({ name: 'first' }, 'en');
                var status4 = $loaderService.sync.isLoading({ name: 'first' }, 'en');

                expect(status1).toBe(true);
                expect(status2).toBe(false);
                expect(status3).toBe(true);
                expect(status4).toBe(false);
            });

            it('should return undefined if part for lang not loaded yet', function () {
                var status1 = $loaderService.sync.isLoaded({ name: 'first' }, 'en');

                $loaderService.sync.loadingOn({ name: 'first' }, 'en');
                var status2 = $loaderService.sync.isLoaded({ name: 'first' }, 'en');

                expect(status1).toBeUndefined();
                expect(status2).toBeUndefined();
            });

            it('should corretly return loaded status', function () {
                $loaderService.sync.loadingOn({ name: 'first' }, 'en');
                $loaderService.sync.loadingOff({ name: 'first' }, 'en');
                var status1 = $loaderService.sync.isLoaded({ name: 'first' }, 'en');

                $loaderService.sync.loadingOn({ name: 'first' }, 'en');
                var status2 = $loaderService.sync.isLoaded({ name: 'first' }, 'en');

                expect(status1).toBe(true);
                expect(status2).toBe(true);
            });

            it('should return true if part for lang not loading and not loaded', function() {
                var status = $loaderService.sync.needLoad({ name: 'first' }, 'en');

                expect(status).toBe(true);
            });

            it('should return false if part for lang loading', function () {
                $loaderService.sync.loadingOn({ name: 'first' }, 'en');
                var status = $loaderService.sync.needLoad({ name: 'first' }, 'en');

                expect(status).toBe(false);
            });

            it('should return false if part for lang loaded', function () {
                $loaderService.sync.loadingOn({ name: 'first' }, 'en');
                $loaderService.sync.loadingOff({ name: 'first' }, 'en');
                var status = $loaderService.sync.needLoad({ name: 'first' }, 'en');

                expect(status).toBe(false);
            });
        });

        describe('>> Counter', function() {
            it('should set counter for lang to two', function() {
                $loaderService.sync.increaseCounter('en');
                $loaderService.sync.increaseCounter('en');

                expect($loaderService.sync.counter['en']).toBe(2);
            });

            it('should set counter for lang to zero', function() {
                $loaderService.sync.increaseCounter('en');
                $loaderService.sync.increaseCounter('en');
                $loaderService.sync.resetCounter('en');

                expect($loaderService.sync.counter['en']).toBe(0);
            });

            it('should generate all parts loaded event if counter for lang equal to parts count', function () {
                var callback = jasmine.createSpy('callback');

                $events.allPartsLoaded.subscribe(callback);

                $loaderService.addPart('first', 'en');
                $loaderService.sync.increaseCounter('en');
                $loaderService.sync.checkCounter('en');

                expect(callback.calls.count()).toBe(1);
                expect(callback.calls.argsFor(0)).toEqual([{lang: 'en'}]);
            });
        });
    });
});