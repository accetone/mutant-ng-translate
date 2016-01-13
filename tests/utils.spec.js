'use strict';

describe('The translate utils test suite', function () {
    var $utils;

    beforeEach(function() {
        module('mutant-ng-translate');

        spyOn(console, 'warn');

        inject(function ($translateUtils) {
            $utils = $translateUtils;
        });
    });

    describe('>> Common tests', function () {
        it('should be defined', function () {
            expect($utils).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $utils).toBe('object');
        });
    });

    describe('>> Data transformation tests', function() {
        it('should return undefined if called without params', function() {
            var values = $utils.directDataTransformation();

            expect(values).toEqual(undefined);
        });

        it('should return not modified values', function () {
            var source = { test: 'test' };
            var values = $utils.directDataTransformation(source);

            expect(values).toEqual(source);
        });
    });

    describe('>> Error & warning tests', function() {
        it('should throw exception with tag when called without params', function() {
            expect($utils.error.throw)
                .toThrowError(/\[mutant-ng-translate\]/);
        });

        it('should throw exception with message', function () {
            expect(function () { $utils.error.throw('custom message'); })
                .toThrowError(/custom message/);
        });

        it('should call console warn with message', function () {
            
            $utils.warning.throw('custom message');

            expect(console.warn.calls.argsFor(0))
                .toMatch(/custom message/);
        });
    });
});