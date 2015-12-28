'use strict';

describe('The translate storage test suite', function () {
    var $translateStorage, en, ru;

    beforeEach(function () {
        module('mutant-ng-translate');

        inject(function (_$translateStorage_) {
            $translateStorage = _$translateStorage_;
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
            key: 'apple'
        };

        ru = {
            lang: 'ru',
            values: {
                'apple': 'Привет, Яблоко!',
                'pear': 'Привет, Груша!'
            },
            moreValues: {
                'apple': 'Привет, Яблоко 2!',
                'peach': 'Привет, Персик!'
            },
            mergedValues: {
                'apple': 'Привет, Яблоко 2!',
                'pear': 'Привет, Груша!',
                'peach': 'Привет, Персик!'
            },
            key: 'apple'
        };
    });

    describe('Common tests', function() {
        it('should be defined', function () {
            expect($translateStorage).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $translateStorage).toBe('object');
        });
    });


    describe('Get/set tests', function() {
        it('should return an empty object if called without lang', function () {
            var values = $translateStorage.getValues();

            expect(values).toEqual({});
        });

        it('should return an empty object if called before set', function () {
            var values = $translateStorage.getValues(en.key);

            expect(values).toEqual({});
        });

        it('should return the values set before', function () {
            $translateStorage.setValues(en.lang, en.values);
            $translateStorage.setValues(ru.lang, ru.values);

            var enValues = $translateStorage.getValues(en.lang);
            var ruValues = $translateStorage.getValues(ru.lang);

            expect(enValues).toEqual(en.values);
            expect(ruValues).toEqual(ru.values);
        });

        it('should not change values if called without values', function () {
            $translateStorage.setValues(en.lang, en.values);
            $translateStorage.setValues(en.lang);
            var values = $translateStorage.getValues(en.lang);

            expect(values).toEqual(en.values);
        });

        it('should use last value if key already exist', function() {
            $translateStorage.setValues(en.lang, en.values);
            $translateStorage.setValues(en.lang, en.moreValues);
            var values = $translateStorage.getValues(en.lang);

            expect(values).toEqual(en.mergedValues);
        });

        it('should return undefined if called without lang and key', function() {
            var value = $translateStorage.getValue();

            expect(value).toBeUndefined();
        });

        it('should return undefined if called without key', function () {
            $translateStorage.setValues(en.lang, en.values);
            var value = $translateStorage.getValue(en.lang);

            expect(value).toBeUndefined();
        });

        it('should return key if don\'t have this key', function () {
            var value = $translateStorage.getValue(en.lang, en.key);

            expect(value).toEqual(en.key);
        });

        it('should return value by key', function () {
            $translateStorage.setValues(en.lang, en.values);
            var value = $translateStorage.getValue(en.lang, en.key);

            expect(value).toEqual(en.values[en.key]);
        });
    });
});