'use strict';

describe('The translate directive test suite', function () {
    var $compile, $rootScope, $translate, options;

    beforeEach(function () {
        module('mutant-ng-translate');

        window.localStorage.clear();

        inject(function (_$translate_, _$compile_, _$rootScope_) {
            $translate = _$translate_;
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });

        options = {
            defaultLang: 'en',
            urlTemplate: '/locale-{part}-{lang}.json'
        };

        $translate.config(options);

        $translate.translations('en', { test: 'test-test' });
    });

    describe('>> Attribute tests', function() {
        it('should contain value for existing key', function() {
            var element = $compile('<div ng-translate="test"></div>')($rootScope);

            expect(element.html()).toContain('test-test');
        });

        it('should contain key for non existing key', function () {
            var element = $compile('<div ng-translate="test2"></div>')($rootScope);

            expect(element.html()).toContain('test2');
        });
    });
});