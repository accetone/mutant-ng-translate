'use strict';

describe('The translate storage test suite', function () {
    var $storage, $utils, en, ru;

    beforeEach(function () {
        module('mutant-ng-translate');

        inject(function ($translateStorage, $translateUtils) {
            $storage = $translateStorage;
            $utils = $translateUtils;
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

    describe('>> Common tests', function() {
        it('should be defined', function () {
            expect($storage).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $storage).toBe('object');
        });
    });

    describe('>> Exists tests', function() {
        it('should return false if called without params', function() {
            var exists = $storage.exists();

            expect(exists).toBe(false);
        });

        it('should return false if called before set', function () {
            var existsLang = $storage.exists(en.lang);
            var existsKey = $storage.exists(en.lang, en.key);

            expect(existsLang).toBe(false);
            expect(existsKey).toBe(false);
        });

        it('should return true if called after set', function () {
            $storage.setValues(en.lang, en.values);
            var existsLang = $storage.exists(en.lang);
            var existsKey = $storage.exists(en.lang, en.key);

            expect(existsLang).toBe(true);
            expect(existsKey).toBe(true);
        });

        it('should return false if key not exist', function () {
            $storage.setValues(en.lang, en.values);
            var exists = $storage.exists(en.lang, en.notExistKey);

            expect(exists).toBe(false);
        });
    });

    describe('>> Get/set tests', function() {
        it('should return an empty object if called without lang', function () {
            var values = $storage.getValues();

            expect(values).toEqual({});
        });

        it('should return an empty object if called before set', function () {
            var values = $storage.getValues(en.key);

            expect(values).toEqual({});
        });

        it('should return the values set before', function () {
            $storage.setValues(en.lang, en.values);
            $storage.setValues(ru.lang, ru.values);

            var enValues = $storage.getValues(en.lang);
            var ruValues = $storage.getValues(ru.lang);

            expect(enValues).toEqual(en.values);
            expect(ruValues).toEqual(ru.values);
        });

        it('should not change values if called without values', function () {
            $storage.setValues(en.lang, en.values);
            $storage.setValues(en.lang);
            var values = $storage.getValues(en.lang);

            expect(values).toEqual(en.values);
        });

        it('should use last value if key already exist', function() {
            $storage.setValues(en.lang, en.values);
            $storage.setValues(en.lang, en.moreValues);
            var values = $storage.getValues(en.lang);

            expect(values).toEqual(en.mergedValues);
        });

        it('should return undefined if called without lang and key', function() {
            var value = $storage.getValue();

            expect(value).toBeUndefined();
        });

        it('should return undefined if called without key', function () {
            $storage.setValues(en.lang, en.values);
            var value = $storage.getValue(en.lang);

            expect(value).toBeUndefined();
        });

        it('should return key if don\'t have this key', function () {
            var value = $storage.getValue(en.lang, en.key, $utils.directKeyResolver);

            expect(value).toEqual(en.key);
        });

        it('should return empty string if don\'t have this key', function() {
            var value = $storage.getValue(en.lang, en.key, function() { return ''; });

            expect(value).toEqual('');
        });

        it('should return value by key', function () {
            $storage.setValues(en.lang, en.values);
            var value = $storage.getValue(en.lang, en.key, $utils.directKeyResolver);

            expect(value).toEqual(en.values[en.key]);
        });
    });
});