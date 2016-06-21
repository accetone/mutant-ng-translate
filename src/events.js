(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateEvents', ['$translateUtils', translateEvents]);

    /**
     * @ngdoc service
     * @name translate.events
     * @requires translate.utils
     * 
     * @description 
     * Service responsible for providing access to library events. 
     * Provide list of event objects and you can subscribe to each (see implementation {@link translate.event here}). 
     * 
     * @example
     * ```javascript
     * var callback = function (data) { console.log(data); }
     * 
     * // how subscribe ?
     * var token = $translateEvents.langChanged.subscribe(callback);
     * 
     * // how unsibscribe ?
     * token.unsibscribe();
     * 
     * // how to register one-time callback ?
     * var token2 = $translateEvents.langChanged.subscribe(callback, true);
     * ```
     */
    function translateEvents($utils) {
        var self = this;

        /**
         * @ngdoc event
         * @eventOf translate.events
         * @name partLoaded
         * 
         * @param {string} data { part: partname, lang: language key }
         * 
         * @description 
         * Fires when any part for any language loaded
         */
        self.partLoaded = new event($utils);

        /**
         * @ngdoc event
         * @eventOf translate.events
         * @name allPartsLoaded
         * 
         * @param {string} data { lang: language key }
         * 
         * @description 
         * Fires when all registered parts for some language loaded
         */
        self.allPartsLoaded = new event($utils);

        /**
         * @ngdoc event
         * @eventOf translate.events
         * @name translationsUpdated
         * 
         * @param {string} data { lang: language key }
         * 
         * @description 
         * Fires when translations for any language updated
         */
        self.translationsUpdated = new event($utils);

        /**
         * @ngdoc event
         * @eventOf translate.events
         * @name langChanged
         * 
         * @param {string} data { from: old language key, to: new language key }
         * 
         * @description 
         * Fires when language changed
         */
        self.langChanged = new event($utils);

        return self;
    }

    /**
     * @ngdoc object
     * @name translate.event
     * @requires translate.utils
     * 
     * @description
     * Used to create event objects in {@link translate.events}
     */
    function event($utils) {
        var self = this;
       
        self.subscribers = [];
        self.subscribe = subscribe;
        self.once = once;
        self.unsubscribe = unsubscribe;
        self.publish = publish;

        self.id = 0;
        self.generateId = generateId;

        return {
            subscribe: self.subscribe,
            once: self.once,
            publish: self.publish
        };

        /**
         * @ngdoc method
         * @methodOf translate.event
         * @name subscribe
         * 
         * @param {function} callback Event callback
         * @param {boolean} [disposable] Disposable
         * @returns {Object} Subscribtion Token
         * 
         * @description 
         * Put callback to subscribers list. 
         * Return subscription token, so subscriber can unsubscribe.
         * Disposable subscription mean automatical unsubscribe after one call
         */
        function subscribe(callback, disposable) {
            if (callback == undefined) {
                $utils.error.throw('callback must be defined to subscribe for an event');
            } else if (typeof callback !== 'function') {
                $utils.error.throw('callback must be a function to subscribe for an event');
            }

            var subscriber = {
                id: self.generateId(),
                callback: disposable 
                    ? function() {
                        subscriber.unsubscribe();
                        callback();
                    } 
                    : callback,
                unsubscribe: self.unsubscribe
            };

            self.subscribers.push(subscriber);

            return subscriber;
        }

        /**
         * @ngdoc method
         * @methodOf translate.event
         * @name once
         *
         * @param {function} callback Event callback
         * @returns {Object} Subscribtion Token
         *
         * @description
         * Put callback to subscribers list with automatical unsubscribe after one call (short-hand for subscribe(callback, true)).
         * Return subscription token, so subscriber can unsubscribe.
         */
        function once(callback) {
            return subscribe(callback, true);
        }

        /**
         * @ngdoc method
         * @methodOf translate.event
         * @name unsubscribe
         * 
         * @returns {boolean} Is Success
         * 
         * @description 
         * Delete subscriber from subscribtion list
         */
        function unsubscribe() {
            var index = self.subscribers.indexOf(this);
            if (index === -1) return false;

            self.subscribers.splice(index, 1);
            return true;
        }

        /**
         * @ngdoc method
         * @methodOf translate.event
         * @name publish
         * 
         * @param {Object} data Data
         * 
         * @description 
         * Call all registered callbacks and pass given data to them
         */
        function publish(data) {
            var subscribers = self.subscribers.slice();

            for (var i = 0; i < subscribers.length; i++) {
                subscribers[i].callback(data);
            }
        }

        /**
         * @ngdoc method
         * @methodOf translate.event
         * @name generateId
         * 
         * @returns {number} Id
         * 
         * @description 
         * Generate unique subscribtion id (unique within specific event object)
         */
        function generateId() {
            return self.id++;
        }
    }
})();