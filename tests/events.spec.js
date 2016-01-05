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

    describe('Subscribe exceptions tests', function() {
        it('should throw an exception if called without params', function () {
            expect($translateEvents.partLoaded.subscribe)
                .toThrowError(/callback must be defined to subscribe for an event/);
        });

        it('should throw an exception if callback is not a function', function () {
            expect(function () { $translateEvents.partLoaded.subscribe('callback'); })
                .toThrowError(/callback must be a function to subscribe for an event/);
        });
    });
});