'use strict';

describe('The translate events test suite', function() {
    var $events, callback;

    beforeEach(function() {
        module('mutant-ng-translate');

        inject(function ($translateEvents) {
            $events = $translateEvents;
        });

        callback = jasmine.createSpy('callback');
    });

    describe('>> Common tests', function () {
        it('should be defined', function () {
            expect($events).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $events).toBe('object');
        });
    });

    describe('>> Subscribe exceptions tests', function() {
        it('should throw an exception if called without params', function () {
            expect($events.partLoaded.subscribe)
                .toThrowError(/callback must be defined to subscribe for an event/);
        });

        it('should throw an exception if callback is not a function', function () {
            expect(function () { $events.partLoaded.subscribe('callback'); })
                .toThrowError(/callback must be a function to subscribe for an event/);
        });
    });

    describe('>> Subscribe tests', function() {
        it('should call registered callback', function () {
            $events.partLoaded.subscribe(callback);
            $events.partLoaded.publish();

            expect(callback.calls.count()).toBe(1);
        });

        it('should call all registered callbacks', function () {
            $events.partLoaded.subscribe(callback);
            $events.partLoaded.subscribe(callback);
            $events.partLoaded.publish();

            expect(callback.calls.count()).toBe(2);
        });

        it('should not call callback if unsibscribed', function () {
            $events.partLoaded.subscribe(callback);
            $events.partLoaded.subscribe(callback).unsubscribe();
            $events.partLoaded.publish();

            expect(callback.calls.count()).toBe(1);
        });

        it('should call callback one time if disposable', function () {
            $events.partLoaded.subscribe(callback, true);
            $events.partLoaded.publish();
            $events.partLoaded.publish();

            expect(callback.calls.count()).toBe(1);
        });
    });
});