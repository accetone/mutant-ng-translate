﻿'use strict';

describe('The translate loader service test suite', function () {
    var $loaderService, $storageService, $events, $httpBackend, $timeout, options;

    beforeEach(function () {
        module('mutant-ng-translate');

        inject(function ($translateLoaderSvc, $translateStorageSvc, $translateEvents, _$httpBackend_, _$timeout_) {
            $loaderService = $translateLoaderSvc;
            $storageService = $translateStorageSvc;
            $events = $translateEvents;
            $httpBackend = _$httpBackend_;
            $timeout = _$timeout_;
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
                langs: ['en', 'ru'],
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

            it('should return false if part for lang not loaded yet', function () {
                var status1 = $loaderService.sync.isLoaded({ name: 'first' }, 'en');

                $loaderService.sync.loadingOn({ name: 'first' }, 'en');
                var status2 = $loaderService.sync.isLoaded({ name: 'first' }, 'en');

                expect(status1).toBe(false);
                expect(status2).toBe(false);
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

    describe('>> Parts tests', function () {
        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('>> Add', function () {
            it('should add new part and load it', function () {
                $loaderService.addPart('first', 'en');

                expect($loaderService.parts).toEqual([{ name: 'first' }]);

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.flush();
            });
            
            it('should not add two parts and load them', function () {
                $loaderService.addParts(['first', 'second'], 'en');

                expect($loaderService.parts).toEqual([{ name: 'first' }, { name: 'second' }]);

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.expect('GET', '/locale-second-en.json').respond({});
                $httpBackend.flush();
            });

            it('should throw error if part name not a string', function() {
                expect(function() {
                    $loaderService.addPart(42);
                }).toThrowError(/incorrect value for part name/);
            });

            it('should not add part with duplicate name', function () {
                $loaderService.addPart('first', 'en');
                $loaderService.addPart('first', 'en');

                expect($loaderService.parts).toEqual([{ name: 'first' }]);

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.flush();
            });
        });

        describe('>> Load', function () {
            it('should load part for lang and put it to storage', function() {
                $loaderService.loadPart({ name: 'first' }, 'en');

                $httpBackend
                    .expect('GET', '/locale-first-en.json')
                    .respond({ test: 'test' });
                $httpBackend.flush();

                var translations = $storageService.getTranslations('en');

                expect(translations).toEqual({ test: 'test' });
            });

            it('should switch loading status correctly', function () {
                var part = { name: 'first' };

                $loaderService.loadPart(part, 'en');
                var status1 = $loaderService.sync.isLoading(part, 'en');

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.flush();
                var status2 = $loaderService.sync.isLoading(part, 'en');

                expect(status1).toBe(true);
                expect(status2).toBe(false);
            });

            it('should switch loaded status correctly', function () {
                var part = { name: 'first' };

                $loaderService.loadPart(part, 'en');
                var status1 = $loaderService.sync.isLoaded(part, 'en');

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.flush();
                var status2 = $loaderService.sync.isLoaded(part, 'en');

                $loaderService.loadPart(part, 'en');
                var status3 = $loaderService.sync.isLoaded(part, 'en');

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.flush();

                expect(status1).toBe(false);
                expect(status2).toBe(true);
                expect(status3).toBe(true);
            });

            it('should increase counter by one for one part loaded', function() {
                $loaderService.loadPart({ name: 'first' }, 'en');
                $loaderService.loadPart({ name: 'second' }, 'en');

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.expect('GET', '/locale-second-en.json').respond({});
                $httpBackend.flush();

                expect($loaderService.sync.counter['en']).toBe(2);
            });

            it('should generate part loaded event', function () {
                var callback = jasmine.createSpy('callback');

                $events.partLoaded.subscribe(callback);

                $loaderService.loadPart({ name: 'first' }, 'en');

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.flush();

                expect(callback.calls.count()).toBe(1);
                expect(callback.calls.argsFor(0)).toEqual([{ part: 'first', lang: 'en' }]);
            });

            it('should load all parts', function() {
                $loaderService.parts.push({ name: 'first' });
                $loaderService.parts.push({ name: 'second' });

                $loaderService.loadParts('en');

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.expect('GET', '/locale-second-en.json').respond({});
                $httpBackend.flush();
            });

            it('should load only parts not loaded early', function () {
                $loaderService.parts.push({ name: 'first' });

                $loaderService.loadParts('en');

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.flush();

                $loaderService.parts.push({ name: 'second' });

                $loaderService.loadParts('en');

                $httpBackend.expect('GET', '/locale-second-en.json').respond({});
                $httpBackend.flush();
            });

            it('should load all parts if called with force', function() {
                $loaderService.parts.push({ name: 'first' });

                $loaderService.loadParts('en');

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.flush();

                $loaderService.parts.push({ name: 'second' });

                $loaderService.loadParts('en', true);

                $httpBackend.expect('GET', '/locale-first-en.json').respond({});
                $httpBackend.expect('GET', '/locale-second-en.json').respond({});
                $httpBackend.flush();
            });
        });
    });

    describe('>> Preload tests', function () {
        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
            $timeout.verifyNoPendingTasks();
        });

        it('should start preload', function () {
            $loaderService.options.preload.enabled = true;
            $loaderService.parts.push({ name: 'first' });

            $events.allPartsLoaded.publish();
            
            $httpBackend.expect('GET', '/locale-first-en.json').respond({});
            $httpBackend.expect('GET', '/locale-first-ru.json').respond({});

            $timeout.flush();
            $httpBackend.flush();
            $timeout.flush();
        });

        it('should not start preload', function () {
            $loaderService.options.preload.enabled = false;
            $loaderService.parts.push({ name: 'first' });

            $events.allPartsLoaded.publish();
        });
    });
});