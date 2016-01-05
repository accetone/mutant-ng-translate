(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateEvents', ['$translateUtils', tranlslateEvents]);

    function tranlslateEvents($utils) {
        var self = this;

        self.partLoaded = new event($utils);
        self.allPartsLoaded = new event($utils);
        self.translationsUpdated = new event($utils);
        self.langChanged = new event($utils);

        return self;
    };

    function event($utils) {
        var self = this;
       
        self.subscribers = [];
        self.subscribe = subscribe;
        self.unsubscribe = unsubscribe;
        self.publish = publish;

        self.id = 0;
        self.generateId = generateId;

        return {
            subscribe: self.subscribe,
            publish: self.publish
        };

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

        function unsubscribe() {
            var index = self.subscribers.indexOf(this);
            if (index === -1) return false;

            self.subscribers.splice(index, 1);
            return true;
        }

        function publish(data) {
            var subscribers = self.subscribers.slice();

            for (var i = 0; i < subscribers.length; i++) {
                subscribers[i].callback(data);
            }
        }

        function generateId() {
            return self.id++;
        }
    }
})();