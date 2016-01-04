'use strict';

describe('The translate cache test suite', function() {
    var $translateCache, en, ru;

    beforeEach(function () {
        module('mutant-ng-translate');

        window.localStorage.clear();

        inject(function (_$translateCache_) {
            $translateCache = _$translateCache_;
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

    describe('Common tests', function () {
        it('should be defined', function () {
            expect($translateCache).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $translateCache).toBe('object');
        });
    });

    describe('Get/set values tests', function () {
        it('should return an empty object if called without lang', function () {
            var values = $translateCache.getValues();

            expect(values).toEqual({});
        });

        it('should return an empty object if called before set', function () {
            var values = $translateCache.getValues(en.key);

            expect(values).toEqual({});
        });

        it('should return the values set before', function () {
            $translateCache.setValues(en.lang, en.values);
            $translateCache.setValues(ru.lang, ru.values);

            var enValues = $translateCache.getValues(en.lang);
            var ruValues = $translateCache.getValues(ru.lang);

            expect(enValues).toEqual(en.values);
            expect(ruValues).toEqual(ru.values);
        });

        it('should not change values if called without values', function () {
            $translateCache.setValues(en.lang, en.values);
            $translateCache.setValues(en.lang);
            var values = $translateCache.getValues(en.lang);

            expect(values).toEqual(en.values);
        });

        it('should use last value if key already exist', function () {
            $translateCache.setValues(en.lang, en.values);
            $translateCache.setValues(en.lang, en.moreValues);
            var values = $translateCache.getValues(en.lang);

            expect(values).toEqual(en.mergedValues);
        });
    });

    describe('Get/set lang tests', function() {
        it('should return an undefined if called without set', function () {
            var lang = $translateCache.getLang();

            expect(lang).toEqual(undefined);
        });

        it('should return the lang set before', function () {
            $translateCache.setLang(en.lang);
            var lang = $translateCache.getLang();

            expect(lang).toEqual(en.lang);
        });

        it('should return last lang set', function () {
            $translateCache.setLang(en.lang);
            $translateCache.setLang(ru.lang);
            var lang = $translateCache.getLang();

            expect(lang).toEqual(ru.lang);
        });
    });
});