(function() {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateUtils', [tranlslateUtils]);

    /**
     * @ngdoc service
     * @name translate.utils
     * 
     * @description 
     * Service provides some utility functions like errors, warnings and etc.
     */
    function tranlslateUtils() {
        var self = this;

        /**
         * @ngdoc method
         * @methodOf translate.utils
         * @name directDataTransformation
         * 
         * @param {Object} data Data
         * @returns {Object} Transformed Values
         * 
         * @description 
         * Return passed values without changes. 
         * Used for default transformation of received translations data
         */
        self.directDataTransformation = function (data) {
            return data;
        };

        /**
         * @ngdoc method
         * @methodOf translate.utils
         * @name complexDataTransformation
         *
         * @param {Object} data Data
         * @returns {Object} Transformed Values
         *
         * @description
         * Transfrom complex object to flat object.
         * Translations will be available via '.' (see example)
         *
         * @example
         * ```javascript
         * $translate.config({
         *      ...
         *      dataTranformation: $translateUtils.complexDataTransformation
         * });
         * ```
         *
         * Input:
         * ```json
         * {
         *   "title": "Translator",
         *   "dashboard": {
         *     "hello": "Hallo!",
         *     "menu": {
         *       "main": "Home"
         *     }
         *   }
         * }
         * ```
         *
         * Output:
         * ```json
         * {
         *   "title": "Translator",
         *   "dashboard.hello": "Hallo!",
         *   "dasboard.menu.main": "Home"
         * }
         * ```
         */
        self.complexDataTransformation = function (data) {
            if (data == undefined) return;

            return flattenObject(data, '');

            function flattenObject(obj, prefix) {
                var flat = {};

                for (var p in obj) {
                    if (!obj.hasOwnProperty(p)) continue;



                    if (typeof obj[p] === 'string') {
                        flat[prefix + p] = obj[p]
                    }
                    else {

                        angular.merge(flat, flattenObject(obj[p], prefix + p + '.'));
                    }
                }

                return flat;
            }
        };

        /**
         * @ngdoc method
         * @methodOf translate.utils
         * @name directKeyResolver
         * 
         * @param {string} key Key
         * @returns {string} Value
         * 
         * @description 
         * Return passed key without changes.
         * Used for default key resolving when external code require non existing key
         */
        self.directKeyResolver = function (key) {
            return key;
        };

        /**
         * @ngdoc method
         * @methodOf translate.utils
         * @name errorThrow
         * 
         * @description 
         * Throw error with library prefix
         * 
         * @example 
         * ```javascript
         * $translateUtils.error.throw('error message');
         * ```
         */
        self.error = {
            prefix: '[mutant-ng-translate]: ',
            throw: function (message) {
                throw new Error(self.error.prefix + message);
            }
        };

        /**
         * @ngdoc method
         * @methodOf translate.utils
         * @name warningThrow
         * 
         * @description 
         * Write warning with library prefix
         * 
         * @example 
         * ```javascript
         * $translateUtils.warning.throw('error message');
         * ```
         */
        self.warning = {
            write: console != undefined
                && console.warn != undefined
                && typeof console.warn === 'function'
                ? console.warn
                : function() {},
            throw: function(message) {
                self.warning.write(self.error.prefix + message);
            }
        };

        return self;
    };
})();