'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: function () {
            var context = this;
            var methods = getBindingMethods(this);
            Object.defineProperty(methods, 'not', {
                get: function () {
                    var notMethods = getBindingMethods(context);
                    var functions = Object.keys(notMethods);
                    for (var i = 0; i < functions.length; i++) {
                        notMethods[functions[i]] = function () {
                            return !notMethods[functions[i]];
                        };
                    }
                    return notMethods;
                }
            });
            return methods;
        }
    });
};

function getBindingMethods(context) {
    var allMethods = getMethods(context);
    var methods = Object.keys(allMethods);
    for (var i = 0; i < methods.length; i++) {
        allMethods[methods[i]] = allMethods[methods[i]].bind(context);
    }
    return allMethods;
}

function getMethods(context) {
    if (Object.getPrototypeOf(context) === Array.prototype ||
        Object.getPrototypeOf(context) === Object.prototype) {
        return {
            containsKeys: function (keys) {
                return keys.every(key => Object.keys(context).indexOf(key) !== -1);
            },

            hasKeys: function (keys) {
                return Object.keys(context).every(key => keys.indexOf(key) !== -1);
            },

            containsValues: function (values) {
                return values.every(value => context.indexOf(value) !== -1);
            },

            hasValues: function (values) {
                return Object.keys(context).every(key => values.indexOf(context[key]) !== -1);
            },

            hasValueType: function (key, type) {
                var types = ['string', 'number', 'function', 'array'];
                return types.indexOf(typeof type()) !== -1 && typeof context[key] === typeof type();
            },

            hasLength: function (length) {
                if (Object.getPrototypeOf(context) === Array.prototype) {
                    return context.length === length;
                }
                return undefined;
            }
        };
    } else if (Object.getPrototypeOf(context) === Function.prototype) {
        return {
            hasParamsCount: function (count) {
                return context.length === count;
            }
        };
    } else if (Object.getPrototypeOf(context) === String.prototype) {
        return {
            hasWordsCount: function (count) {
                var words = context.split(/\s/);
                var wordsCount = 0;
                for (var i = 0; i < words.length; i++) {
                    if (words[i].length > 0) {
                        wordsCount += 1;
                    }
                }
                return wordsCount === count;
            },

            hasLength: function (length) {
                return context.length === length;
            }
        };
    } else {
        return undefined;
    }
}
