'use strict';

describe('The translate cache test suite', function() {
    var $cache, en, ru;

    beforeEach(function () {
        module('mutant-ng-translate');

        window.localStorage.clear();

        inject(function ($translateCache) {
            $cache = $translateCache;
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
    });

    describe('>> Common tests', function () {
        it('should be defined', function () {
            expect($cache).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $cache).toBe('object');
        });
    });

    describe('>> Get/set values tests', function () {
        it('should return an empty object if called without lang', function () {
            var values = $cache.getValues();

            expect(values).toEqual({});
        });

        it('should return an empty object if called before set', function () {
            var values = $cache.getValues(en.key);

            expect(values).toEqual({});
        });

        it('should return the values set before', function () {
            $cache.setValues(en.lang, en.values);
            $cache.setValues(ru.lang, ru.values);

            var enValues = $cache.getValues(en.lang);
            var ruValues = $cache.getValues(ru.lang);

            expect(enValues).toEqual(en.values);
            expect(ruValues).toEqual(ru.values);
        });

        it('should not change values if called without values', function () {
            $cache.setValues(en.lang, en.values);
            $cache.setValues(en.lang);
            var values = $cache.getValues(en.lang);

            expect(values).toEqual(en.values);
        });

        it('should use last value if key already exist', function () {
            $cache.setValues(en.lang, en.values);
            $cache.setValues(en.lang, en.moreValues);
            var values = $cache.getValues(en.lang);

            expect(values).toEqual(en.mergedValues);
        });
    });

    describe('>> Get/set lang tests', function() {
        it('should return an undefined if called without set', function () {
            var lang = $cache.getLang();

            expect(lang).toEqual(undefined);
        });

        it('should return the lang set before', function () {
            $cache.setLang(en.lang);
            var lang = $cache.getLang();

            expect(lang).toEqual(en.lang);
        });

        it('should return last lang set', function () {
            $cache.setLang(en.lang);
            $cache.setLang(ru.lang);
            var lang = $cache.getLang();

            expect(lang).toEqual(ru.lang);
        });
    });
});