/**
 * notification.js
 * Notification wrapper that offers an common interface to different javascript notification libraries around there
 *
 * Example file
 * @license MIT
 * @author Pablo Pizarro @ppizarror.com
 */

$(function () {

    /**
     * ------------------------------------------------------------------------
     * Utils
     * ------------------------------------------------------------------------
     */

    /**
     * String format
     */
    if (!String.prototype.format) {
        String.prototype.format = function () {
            let args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined' ?
                    args[number] :
                    match;
            });
        };
    }

    /**
     * Auto center main panel
     */
    let $resize = function () {
        let $f = function getHeight(e) {
            return Math.max(e.scrollHeight, e.offsetHeight);
        };
        let element = document.getElementById('panel');
        let height = Math.max($f(document.body), $f(document.documentElement));
        element.style.top = (height - $f(element)) / 2 + 'px';
    };
    setInterval($resize, 100);
    $resize();

    /**
     * JSON syntax highlight
     * @param {string} json
     * @return {string}
     */
    function syntaxHighlight(json) {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    /**
     * ------------------------------------------------------------------------
     * Creation option globals
     * ------------------------------------------------------------------------
     */
    let $init = {
        core: 'jquery-toast-plugin',
        enabled: true,
        exceptionTitle: 'Exception',
        maxStack: 5,
        timeout: 5000,
    };
    let $calls = {
        info: {
            msg: 'NotificationJS.info(<span class="call-message">"{0}</span>", {1})',
            params: {persistent: true},
            fun: function ($t) {
                $('#callInfo').html($calls.info.msg.format($t, JSON.stringify($calls.info.params)));
            },
        },
        success: {
            msg: 'NotificationJS.success(<span class="call-message">"{0}</span>", {1})',
            params: {},
            fun: function ($t) {
                $('#callSuccess').html($calls.success.msg.format($t, JSON.stringify($calls.success.params)));
            },
        },
        warning: {
            msg: 'NotificationJS.warning(<span class="call-message">"{0}</span>", {1})',
            params: {closebutton: true, doubletime: true},
            fun: function ($t) {
                $('#callWarning').html($calls.warning.msg.format($t, JSON.stringify($calls.warning.params)));
            },
        },
        error: {
            msg: 'NotificationJS.error(<span class="call-message">"{0}</span>", {1})',
            params: {onclick: function () {alert('ppizarror');}},
            fun: function ($t) {
                $('#callError').html($calls.error.msg.format($t, '{"onclick": function () {alert("ppizarror");}'));
            }
        },
        other: {
            msg: 'NotificationJS.other(<span class="call-message">"{0}</span>", {1})',
            params: {},
            fun: function ($t) {
                $('#callOther').html($calls.other.msg.format($t, '{}'));
            }
        }
    };
    let $callsk = Object.keys($calls);

    /**
     * ------------------------------------------------------------------------
     * Write options
     * ------------------------------------------------------------------------
     */

        // Libraries
    let $libs = NotificationJS.lib;
    let $k = Object.keys($libs);
    let $select = $('#notification-lib');
    for (let i = 0; i < $k.length; i++) {
        $select.append('<option value="{0}">{0}</option>'.format($libs[$k[i]]));
    }
    $select.on('change', function () {
        NotificationJS.clearall();
        $init.core = $select.val();
        $writeOptions();
    });
    $init.core = $select.val();

    // Message
    let $message = $('#notificationMessage');
    let $changeCallMsg = function () {
        let $text = $message.val();
        for (let i = 0; i < $callsk.length; i++) $calls[$callsk[i]].fun($text);
    };
    $message.on('keyup', function () {
        $changeCallMsg();
    });

    // Timeout
    let $timeout = $('#timeout');
    $timeout.val($init.timeout);
    $timeout.on('change', function () {
        $init.timeout = parseInt($timeout.val().toString());
        $writeOptions();
    });

    // Max stack
    let $maxStack = $('#maxStack');
    $maxStack.val($init.maxStack);
    $maxStack.on('change', function () {
        $init.maxStack = parseInt($maxStack.val().toString());
        $writeOptions();
    });

    // Enabled message
    let $enabledMessage = $('#enabledMessage');
    $enabledMessage.bootstrapSwitch({size: 'md'});
    $enabledMessage.on('change', function () {
        $init.enabled = $enabledMessage.is(':checked');
        $writeOptions();
    });

    /**
     * Write options to example
     */
    let $writeOptions = function () {
        NotificationJS.init($init);
        $('.options-javascript').html('NotificationJS.init({0});'.format(syntaxHighlight(JSON.stringify($init, undefined, 4))));
    };
    $writeOptions();

    /**
     * ------------------------------------------------------------------------
     * Write calls
     * ------------------------------------------------------------------------
     */

    let $callPanel = $('.panel-calls');

    // Info notification
    $callPanel.append('<div class="call info" id="callInfo"></div>');
    $('#callInfo').on('click', function () {
        NotificationJS.info($('#notificationMessage').val(), $calls.info.params);
    });

    // Success notification
    $callPanel.append('<div class="call success" id="callSuccess"></div>');
    $('#callSuccess').on('click', function () {
        NotificationJS.success($('#notificationMessage').val(), $calls.success.params);
    });

    // Warning notification
    $callPanel.append('<div class="call warn" id="callWarning"></div>');
    $('#callWarning').on('click', function () {
        NotificationJS.warning($('#notificationMessage').val(), $calls.warning.params);
    });

    // Error notification
    $callPanel.append('<div class="call errorcall" id="callError"></div>');
    $('#callError').on('click', function () {
        NotificationJS.error($('#notificationMessage').val(), $calls.error.params);
    });

    // Other notification
    $callPanel.append('<div class="call othercall" id="callOther"></div>');
    $('#callOther').on('click', function () {
        NotificationJS.other($('#notificationMessage').val(), $calls.other.params);
    });

    // Set message
    $changeCallMsg();

    // Delete buttons
    $callPanel.append('<div class="callBottom"><button id="clearAll" class="btn btn-danger" title="NotificationJS.clearall()">Clear All</button><button id="clearLast" class="btn" title="NotificationJS.clearlast()">Clear Last</button></div>');

    $('#clearAll').on('click', function () {
        NotificationJS.clearall();
    });

    $('#clearLast').on('click', function () {
        NotificationJS.clearlast();
    });

});