(function () {
    'use strict';

    angular
        .module('mutant-ng-translate')
        .factory('$translateEvents', [tranlslateEvents]);

    function tranlslateEvents() {
        var self = this;

        self.partLoaded = new event();
        self.allPartsLoaded = new event();
        self.translationsUpdated = new event();
        self.langChanged = new event();

        return self;
    };

    function event() {
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