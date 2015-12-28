'use strict';

describe('The translate storage test suite', function () {
    var $translateStorage, firstLang, secondLang, firstValues, secondValues;

    beforeEach(function () {
        module('mutant-ng-translate');

        inject(function (_$translateStorage_) {
            $translateStorage = _$translateStorage_;
        });
        
        firstLang = 'en';
        secondLang = 'ru';

        firstValues = {
            'apple': 'Hello, Apple!',
            'pear': 'Hello, Pear!'
        };

        secondValues = {
            'apple': 'Привет, Яблоко!',
            'pear': 'Привет, Груша!'
        };
    });

    it('should be defined', function() {
        expect($translateStorage).toBeDefined();
    });

    it('should be an object', function () {
        expect(typeof $translateStorage).toBe('object');
    });
});