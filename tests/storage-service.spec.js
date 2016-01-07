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
});