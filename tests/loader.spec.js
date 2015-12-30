'use strict';

describe('The translate loader test suite', function() {
    var $translateLoader, $httpBackend, $http, en, ru, options;

    beforeEach(function() {
        module('mutant-ng-translate');

        inject(function (_$translateLoader_, _$httpBackend_, _$http_) {
            $httpBackend = _$httpBackend_;
            $translateLoader = _$translateLoader_;
            $http = _$http_;

            en = {
                lang: 'en',
                values: {
                    'apple': 'Hello, Apple!',
                    'pear': 'Hello, Pear!'
                },
                moreValues: {
                    'apple': 'Hello, Apple 2!',
                    'peach': 'Hello, Peach!'
                },
                mergedValues: {
                    'apple': 'Hello, Apple 2!',
                    'pear': 'Hello, Pear!',
                    'peach': 'Hello, Peach!'
                },
                key: 'apple',
                notExistKey: 'lime'
            };

            ru = {
                lang: 'ru',
                values: {
                    'apple': 'Привет, Яблоко!',
                    'pear': 'Привет, Груша!'
                }
            };

            options = {
                urlTemplate: '/locale-{part}-{lang}.json',
                dataTransformation: function(x) {
                    return x;
                }
            }

            $httpBackend
                .when('GET', '/locale-first-en.json')
                .respond(200, en.values);
        });
    });

    describe('Common tests', function () {
        it('should be defined', function () {
            expect($translateLoader).toBeDefined();
        });

        it('should be an object', function () {
            expect(typeof $translateLoader).toBe('object');
        });
    });
});