/*!
 * Keyboard Listener jQuery Plugin v1.0.b
 * http://zhaoshouren.com/
 *
 * Copyright 2010, Warren Chu
 * licensed under the MIT license
 *
 * requires:
 *  jQuery JavaScript Library
 *  http://jquery.com/
 * compatible with:
 *  v1.4.2
 */

/* JSLint – The JavaScript Code Quality Tool
 * http://www.jslint.com/
 *
 * settings below
 */
/*global jQuery*/
/*jslint
    white: true,
    browser: true,
    onevar: true,
    undef: true,
    nomen: true,
    eqeqeq: true,
    plusplus: true,
    bitwise: true,
    regexp: true,
    newcap: true,
    immed: true,
    strict: true
 */

"use strict"; // ES5 strict mode

(function (jQuery) {
    var defaults = {
            bubble: true,
            delimiter: '_',
            handlers: {
                keyup: {},
                keydown: {}
            }
        },
        key = 'kbl:config',
        keyMap = {},
        keys = [];

    function exists(keys, code) {
        var index, limit;
        for (index = 0, limit = keys.length; index < limit; index += 1) {
            if (keys[index] === code) {
                return true;
            }
        }
        return false;
    }

    function execute(configuration, event, $this) {
        var handler = configuration.handlers[event.type][jQuery.map(keys, function (code) {
                return keyMap[code];
            }).join(configuration.delimiter) || keyMap[event.which]];

        if (!configuration.bubble) {
            event.stopPropagation();
        }

        if (typeof(handler) === 'function') {
            handler.call($this, event);
        }
    }

    jQuery.fn.extend({
        keyboardListener: function (new_configuration) {
            var $this = this;

            return this.each(function () {
                var $that = $this,
                    configuration = jQuery.extend(true, {}, defaults, $that.data(key), new_configuration);

                $that.data(key, configuration);

                return function () {
                    $that.bind({
                        'keydown.kbl': function (event) {
                            var code = event.which;

                            if (!exists(keys, code)) {
                                keys.push(code);
                            }
                            execute(configuration, event, $that);
                        },
                        'keyup.kbl': function (event) {
                            var code = event.which,
                                index, limit;

                            for (index = 0, limit = keys.length; index < limit; index += 1) {
                                if (keys[index] === code) {
                                    keys.splice(index, 1);
                                }
                            }
                            execute(configuration, event, $that);
                        }
                    });
                };
            }());
        }
    });

    jQuery.extend({
        keyboardListener: {
            configuration: function (jQueryObject) {
                return (jQueryObject && jQueryObject.data) ? jQueryObject.data(key) : defaults;
            },
            defaults: function (configuration) {
                return jQuery.extend(true, defaults, configuration);
            },
            keyMap: function (new_keyMap) {
                return jQuery.extend(keyMap, new_keyMap);
            },
            unbind: function (jQueryObject, keyupdown, combination) {
                var handlers = this.configuration(jQueryObject).handlers[keyupdown],
                    handler;

                for (handler in handlers) {
                    if (handler === combination) {
                        delete handlers[handler];
                    }
                }
            }
        }
    });
}(jQuery));
