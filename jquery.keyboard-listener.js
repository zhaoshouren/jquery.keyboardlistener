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

jQuery(function ($) {
    var defaults = {
            bubble: true,
            delimiter: '_',
            handlers: {
                keyup: {},
                keydown: {}
            }
        },
        dataKey = 'kbl:config',
        keyMap = {},
        keys = [];

    function exists(keyCode) {
        var i;
        for (i = 0; i < keys.length; i = i + 1) {
            if (keys[i] === keyCode) {
                return false;
            }
        }
        return true;
    }

    function execute($config, $event, $this) {
        var handler = $config.handlers[$event.type][$.map(keys, function ($code) {
                return keyMap[$code];
            }).join($config.delimiter) || keyMap[$event.which]];

        if (!$config.bubble) {
            $event.stopPropagation();
        }

        if (typeof(handler) === 'function') {
            handler($this, $event);
        }
    }

    $.fn.extend({
        keyboardListener: function ($config) {
            var $this = $(this);
            return this.each(function () {
                var $that = $this,
                    config = $.extend(true, {}, defaults, $that.data(dataKey), $config);

                $that.data(dataKey, config);

                return function () {
                    $that.bind({
                        'keydown.kbl': function ($event) {
                            var code = $event.which;

                            if (exists(code)) {
                                keys.push(code);
                            }
                            execute(config, $event, $that);
                        },
                        'keyup.kbl': function ($event) {
                            var code = $event.which,
                                i;

                            for (i = 0; i < keys.length; i = i + 1) {
                                if (keys[i] === code) {
                                    keys.splice(i, 1);
                                }
                            }
                            execute(config, $event, $that);
                        }
                    });
                };
            }());
        }
    });

    $.extend({
        keyboardListener: {
            defaults: function ($config) {
                $.extend(true, defaults, $config);

                return defaults;
            },

            keyMap: function ($keyMap) {
                $.extend(keyMap, $keyMap);

                return keyMap;
            },

            config: function ($jQueryElement) {
                return $jQueryElement.data(dataKey);
            }
        }
    });
});
