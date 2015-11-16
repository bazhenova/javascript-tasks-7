'use strict';

exports.init = function () {
    Object.defineProperty(Object.prototype, 'check', {
        get: getBindingMethods
    });
};

function getBindingMethods() {
    var allMethods = getMethods();
    var methods = Object.keys(allMethods);
    for (var i = 0; i < methods.length; i++) {
        allMethods[methods[i]] = allMethods[methods[i]].bind(this);
    }
    return allMethods;
}

function getMethods() {
    return {
        containsKeys: function (keys) {
            if (isRelevantPrototype(this, Array.prototype, Object.prototype)) {
                for (var i = 0; i < keys.length; i++) {
                    if (this.indexOf(keys[i]) === -1) {
                        return false;
                    }
                }
                return true;
            }
            return undefined;
        },

        hasKeys: function (keys) {
            if (isRelevantPrototype(this, Array.prototype, Object.prototype)) {
                var thisKeys = Object.keys(this);
                for (var i = 0; i < thisKeys.length; i++) {
                    if (keys.indexOf(thisKeys[i]) === -1) {
                        return false;
                    }
                }
                return true;
            }
            return undefined;
        },

        containsValues: function (values) {
            if (isRelevantPrototype(this, Array.prototype, Object.prototype)) {
                var thisKeys = Object.keys(this);
                var count = 0;
                for (var i = 0; i < values.length; i++) {
                    if (this.indexOf(values[i]) === -1) {
                        return false;
                    }
                }
                return true;
            }
            return undefined;
        },

        hasValues: function (values) {
            if (isRelevantPrototype(this, Array.prototype, Object.prototype)) {
                var thisKeys = Object.keys(this);
                for (var key in thisKeys) {
                    if (values.indexOf(this[key]) === -1) {
                        return false;
                    }
                }
                return true;
            }
            return undefined;
        },

        hasValueType: function (key, type) {
            if (isRelevantPrototype(this, Array.prototype, Object.prototype)) {
                var types = ['string', 'number', 'function', 'array'];
                return types.indexOf(typeof type()) !== -1 && typeof this[key] === typeof type();
            }
            return undefined;
        },

        hasLength: function (length) {
            if (isRelevantPrototype(this, Array.prototype, String.prototype)) {
                return this.length === length;
            }
            return undefined;
        },

        hasParamsCount: function (count) {
            if (isRelevantPrototype(this, Function.prototype)) {
                return this.length === count;
            }
            return undefined;
        },

        hasWordsCount: function (count) {
            if (isRelevantPrototype(this, String.prototype)) {
                var wordsCount = 0;
                var exist = false;
                for (var i = 0; i < this.length; i++) {
                    if (this[i] === ' ' || i === this.length - 1) {
                        if (exist) {
                            wordsCount += 1;
                            exist = false;
                        }
                    } else {
                        exist = true;
                    }
                }
                return wordsCount === count;
            }
            return undefined;
        }
    };
}

function isRelevantPrototype(source) {
    for (var i = 1; i < arguments.length; i++) {
        if (Object.getPrototypeOf(source) === arguments[i]) {
            return true;
        }
    }
    return false;
}
