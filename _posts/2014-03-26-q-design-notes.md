---
layout: post
title: "Q design notes"
description: ""
category: 
tags: []
---

Q([src](https://github.com/kriskowal/q), [doc](http://documentup.com/kriskowal/q/)) is "a tool for making and composing asynchronous promises in JavaScript".

Below is one common usage of Q:

```javascript
function one(){
    var q = defer();
    
    setTimeout(function(){
        q.resolve(10);
    }, 100);
    
    return q.promise;
}
function two(value){
    var q = defer();
    
    setTimeout(function(){
        q.resolve(value + 10);
    }, 100);
    
    return q.promise;
}
one().then(two).then(function(val){
    console.log(val); //should expect 20
});
```

Here's a brief summary on how it is designed: ([Original Post](https://github.com/kriskowal/q/blob/v1/design/README.js))

## Introduce then/resolve
  - `then`: registering a callback function to the async call. A promise could be registered with multiple callbacks.
  - `resolve`: gets called when async call finishes. It would invoke all registered callbacks with the resolved value.

```javascript
var defer = function () {
    var pending = [], value;
    return {
        resolve: function (_value) {
            if (pending) {
                value = _value;
                for (var i = 0, ii = pending.length; i < ii; i++) {
                    var callback = pending[i];
                    callback(value);
                }
                pending = undefined;
            }
        },
        promise: {
            then: function (callback) {
                if (pending) {
                    pending.push(callback);
                } else {
                    callback(value);
                }
            }
        }
    };
};
```

## Chaining promises
 - `then` should return a promise which gets resolved with the return value of the callback.
 - `resolve` can accept a promise (which implies that `then` can also take a promise as parameter) so that pending callbacks are invoked after it gets resovled.
 
```javascript
var ref = function (value) {
    if (value && typeof value.then === "function")
        return value;
    return {
        then: function (callback) {
            callback(value);
        }
    };
};

var defer = function () {
    var pending = [], value;
    return {
        resolve: function (_value) {
            // pass the value to pending callbacks.
            
            if (pending) {
                value = ref(_value); // values wrapped in a promise
                for (var i = 0, ii = pending.length; i < ii; i++) {
                    var callback = pending[i];
                    // make sure that pending callbacks happen after accepted promise gets resolved first
                    value.then(callback);
                }
                pending = undefined;
            }
        },
        promise: {
            then: function (_callback) {
                // create a new promise upon "then"
                var result = defer();
                
                // the new promise needs to be resolved with the returned value of the current callback.
                var callback = function (value) {
                    result.resolve(_callback(value));
                };
                if (pending) {
                    pending.push(callback);
                } else {
                    value.then(callback);
                }
                return result.promise;
            }
        }
    };
};
```

To be continued.