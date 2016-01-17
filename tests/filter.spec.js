'use strict';

describe('The translate filter test suite', function () {
    var $filter, $translate, options;

    beforeEach(function() {
        module('mutant-ng-translate');

        window.localStorage.clear();

        inject(function (_$translate_, _$filter_) {
            $translate = _$translate_;
            $filter = _$filter_('translate');
        });

        options = {
            defaultLang: 'en',
            urlTemplate: '/locale-{part}-{lang}.json'
        };
    });

    describe('>> Common tests', function () {
        it('should be defined', function () {
            expect($filter).toBeDefined();
        });

        it('should be an function', function () {
            expect(typeof $filter).toBe('function');
        });
    });

    describe('>> Transformation tests', function() {
        beforeEach(function() {
            $translate.config(options);
            $translate.translations('en', { test: 'test-test' });
        });

        it('should return value for existing key', function() {
            var value = $filter('test');

            expect(value).toEqual('test-test');
        });

        it('should return key for non existing key', function () {
            var value = $filter('test2');

            expect(value).toEqual('test2');
        });
    });
});