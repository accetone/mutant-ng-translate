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
});