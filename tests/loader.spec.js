'use strict';

describe('The translate loader test suite', function() {
    var $loader, $httpBackend, en, options;

    beforeEach(function() {
        module('mutant-ng-translate');

        inject(function ($translateLoader, _$httpBackend_) {
            $loader = $translateLoader;
            $httpBackend = _$httpBackend_;

            en = {
                lang: 'en',
                values: {
                    'apple': 'Hello, Apple!',
                    'pear': 'Hello, Pear!'
                },
                transformedValues: {
                    'apple': 'Hello, Apple!Hello, Apple!',
                    'pear': 'Hello, Pear!Hello, Pear!'
                }
            };

            options = {
                urlTemplate: '/locale-{part}-{lang}.json',
                dataTransformation: function(x) {
                    return x;
                },
                part: { name: 'first' },
                lang: en.lang
            }

            $httpBackend
                .when('GET', '/locale-first-en.json')
                .respond(200, en.values);

            $httpBackend
                .when('GET', '/locale-first-en-first-en.json')
                .respond(200, en.values);
        });
    });

    describe('>> Common tests', function () {
        it('should be defined', function () {
            expect($loader).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $loader).toBe('object');
        });
    });

    describe('>> Load part tests', function () {
        it('should return promise', function() {
            var promise = $loader.loadPart(options);

            expect(promise.then).toBeDefined();
            expect(typeof promise.then).toBe('function');

            $httpBackend.flush();
        });

        it('should return not modified values', function(done) {
            $loader
                .loadPart(options)
                .then(function (values) {
                    expect(values).toEqual(en.values);
                })
                .finally(done);

            $httpBackend.flush();
        });

        it('should process urlTemplate with multiple patterns', function (done) {
            options.urlTemplate = '/locale-{part}-{lang}-{part}-{lang}.json';

            $loader
                .loadPart(options)
                .then(function (values) {
                    expect(values).toEqual(en.values);
                })
                .finally(done);

            $httpBackend.flush();
        });

        it('should return transformed values', function (done) {
            options.dataTransformation = function(x) {
                for (var p in x) {
                    if (!x.hasOwnProperty(p)) continue;

                    x[p] = x[p] + x[p];
                };

                return x;
            };

            $loader
                .loadPart(options)
                .then(function (values) {
                    expect(values).toEqual(en.transformedValues);
                })
                .finally(done);

            $httpBackend.flush();
        });
    });
});