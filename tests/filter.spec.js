'use strict';

describe('The translate filter test suite', function () {
    var $filter, $translate, options;

    beforeEach(function() {
        module('mutant-ng-translate');

        inject(function (_$translate_, _$filter_) {
            $translate = _$translate_;
            $filter = _$filter_('translate');
        });

        options = {
            defaultLang: 'en',
            urlTemplate: '/locale-{part}-{lang}.json'
        };

        $translate.config(options);
    });

    describe('>> Common tests', function () {
        it('should be defined', function () {
            expect($filter).toBeDefined();
        });

        it('should be an function', function () {
            expect(typeof $filter).toBe('function');
        });
    });
});