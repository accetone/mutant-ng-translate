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

    });
});