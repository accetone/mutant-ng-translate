'use strict';

describe('The translate events test suite', function() {
    var $translateEvents;

    beforeEach(function() {
        module('mutant-ng-translate');

        inject(function (_$translateEvents_) {
            $translateEvents = _$translateEvents_;
        });
    });

    describe('Common tests', function () {
        it('should be defined', function () {
            expect($translateEvents).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $translateEvents).toBe('object');
        });
    });
});