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
        $init.core = $select.val();
        $writeOptions();
    });
    $init.core = $select.val();

    // Max stack
    let $maxStack = $('#maxStack');
    $maxStack.val($init.maxStack);
    $maxStack.on('change', function () {
        $init.maxStack = parseInt($maxStack.val());
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

});