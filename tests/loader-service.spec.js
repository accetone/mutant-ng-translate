'use strict';

describe('The translate loader service test suite', function () {
    var $service, $storage;

    beforeEach(function () {
        module('mutant-ng-translate');

        inject(function ($translateLoaderSvc, $translateStorage) {
            $service = $translateLoaderSvc;
            $storage = $translateStorage;
        });
    });

    describe('>> Common tests', function () {
        it('should be defined', function () {
            expect($service).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $service).toBe('object');
        });
    });

});