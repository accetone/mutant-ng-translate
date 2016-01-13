'use strict';

describe('The translate service test suite', function () {
    var $translate;

    beforeEach(function () {
        module('mutant-ng-translate');

        inject(function (_$translate_) {
            $translate = _$translate_;
        });
    });

    describe('>> Common tests', function () {
        it('should be defined', function () {
            expect($translate).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $translate).toBe('object');
        });
    });
});