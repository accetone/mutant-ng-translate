'use strict';

describe('The translate events test suite', function() {
    var $translateEvents, callback;

    beforeEach(function() {
        module('mutant-ng-translate');

        inject(function (_$translateEvents_) {
            $translateEvents = _$translateEvents_;
        });

        callback = jasmine.createSpy('callback');
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

    describe('Subscribe tests', function() {
        it('should call registered callback', function () {
            $translateEvents.partLoaded.subscribe(callback);
            $translateEvents.partLoaded.publish();

            expect(callback.calls.count()).toBe(1);
        });

        it('should call all registered callbacks', function () {
            $translateEvents.partLoaded.subscribe(callback);
            $translateEvents.partLoaded.subscribe(callback);
            $translateEvents.partLoaded.publish();

            expect(callback.calls.count()).toBe(2);
        });

        it('should not call callback if unsibscribed', function () {
            $translateEvents.partLoaded.subscribe(callback);
            $translateEvents.partLoaded.subscribe(callback).unsubscribe();
            $translateEvents.partLoaded.publish();

            expect(callback.calls.count()).toBe(1);
        });

        it('should call callback one time if disposable', function () {
            $translateEvents.partLoaded.subscribe(callback, true);
            $translateEvents.partLoaded.publish();
            $translateEvents.partLoaded.publish();

            expect(callback.calls.count()).toBe(1);
        });
    });
});