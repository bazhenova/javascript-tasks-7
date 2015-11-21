'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: function () {
            var methods = getBindingMethods(this);
            var notMethods = getBindingMethods(this);
            var functions = Object.keys(notMethods);
            Object.defineProperty(methods, 'not', {
                get: function () {
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

exports.wrap = function (object) {
    if (object === null) {
        return {
            isNull: function () {
                return true;
            }
        };
    }
    return object;
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
    if (Object.getPrototypeOf(context) === Array.prototype) {
        var commonMethods = getCommonMethods(context);
        commonMethods['hasLength'] = function (length) {
            return context.length === length;
        };
        return commonMethods;
    }
    if (Object.getPrototypeOf(context) === Object.prototype) {
        return getCommonMethods(context);
    }
    if (Object.getPrototypeOf(context) === Function.prototype) {
        return {
            hasParamsCount: function (count) {
                return context.length === count;
            }
        };
    }
    if (Object.getPrototypeOf(context) === String.prototype) {
        return {
            hasWordsCount: function (count) {
                var splited = context.split(/\s/);
                var words = splited.filter(function (element) {
                    return element.length > 0;
                });
                return words.length === count;
            },

            hasLength: function (length) {
                return context.length === length;
            }
        };
    }
    return undefined;
}

function getCommonMethods(context) {
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
            var types = ['string', 'number', 'function', 'array', 'object'];
            var keyType = typeof type();
            return types.indexOf(keyType) !== -1 && typeof context[key] === keyType;
        }
    };
}
