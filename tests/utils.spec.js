'use strict';

describe('The translate utils test suite', function () {
    var $translateUtils;

    beforeEach(function() {
        module('mutant-ng-translate');

        spyOn(console, 'warn');

        inject(function (_$translateUtils_) {
            $translateUtils = _$translateUtils_;
        });
    });

    describe('Common tests', function () {
        it('should be defined', function () {
            expect($translateUtils).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $translateUtils).toBe('object');
        });
    });

    describe('Data transformation tests', function() {
        it('should return undefined if called without params', function() {
            var values = $translateUtils.directDataTransformation();

            expect(values).toEqual(undefined);
        });

        it('should return not modified values', function () {
            var source = { test: 'test' };
            var values = $translateUtils.directDataTransformation(source);

            expect(values).toEqual(source);
        });
    });

    describe('Error & warning tests', function() {
        it('should throw exception with tag when called without params', function() {
            expect($translateUtils.error.throw)
                .toThrowError(/\[mutant-ng-translate\]/);
        });

        it('should throw exception with message', function () {
            expect(function () { $translateUtils.error.throw('custom message'); })
                .toThrowError(/custom message/);
        });

        it('should call console warn with message', function () {
            
            $translateUtils.warning.throw('custom message');

            expect(console.warn.calls.argsFor(0))
                .toMatch(/custom message/);
        });
    });
});