/**
 * notification.js
 * Notification wrapper that offers an common interface to many different javascript notification libraries around there
 *
 * Avaiable libraries:
 *      - toastr
 *      - amaranJS
 *      - jquery-toast-plugin
 *
 * @license MIT
 * @author Pablo Pizarro @ppizarror.com
 */

/**
 * Notification main object
 * @global
 */
let NotificationJS;

/**
 Executes anonymous function on load
 **/
(function () {
    "use strict";

    /**
     * Generic notification class, some key functions:
     *      - closebutton: true/false       Notification has a button to close
     *      - doubletime: true/false        Double timer
     *      - onclick: function/null        Click bind function
     *      - persistent: true/false        Notification auto closes after time or not
     *
     * @class
     * @abstract
     * @private
     */
    let _NotificationType = function () {

        /**
         * Some basic configurations
         */
        this.config = {
            capitalize: false,      // Capitalize the message
            trim: true,             // Trims the message
        };

        /**
         * Object pointer
         * @type {_NotificationType}
         */
        let self = this;

        /**
         * ------------------------------------------------------------------------
         * Abstract functions
         * ------------------------------------------------------------------------
         */

        /**
         * Clear all notifications
         * @function
         * @public
         */
        this.clearall = function () {
        };

        /**
         * Clear last notification
         * @function
         * @public
         */
        this.clearlast = function () {
        };

        /**
         * Error notification
         * @function
         * @public
         * @param {string} msg - Error message
         * @param {object} $options - Options
         */
        this.error = function (msg, $options) {
        };

        /**
         * Exception notification
         * @function
         * @public
         * @param {Error} msg - Exception message
         * @param {object} $options - Options
         */
        this.exception = function (msg, $options) {
        };

        /**
         * Info notification
         * @function
         * @public
         * @param {string} msg - Message
         * @param {object} $options - Options
         */
        this.info = function (msg, $options) {
        };

        /**
         * Generic notification
         * @function
         * @public
         * @param {string} msg - Message
         * @param {object} $options - Options
         */
        this.other = function (msg, $options) {
        };

        /**
         * Success notification
         * @function
         * @public
         * @param {string} msg - Message
         * @param {object} $options - Options
         */
        this.success = function (msg, $options) {
        };

        /**
         * Warning notification
         * @function
         * @public
         * @param {string} msg - Message
         * @param {object} $options - Options
         */
        this.warning = function (msg, $options) {
        };

        /**
         * ------------------------------------------------------------------------
         * Non abstract functions
         * ------------------------------------------------------------------------
         */

        /**
         * Message format
         * @function
         * @protected
         * @param {string} msg - Message
         * @returns {string} - Message formatted
         * @ignore
         */
        this._format = function (msg) {

            /**
             * Trims the message
             */
            if (this.config.trim) msg = msg.trim();

            /**
             * Capitalizes the message
             * @function
             * @private
             * @param {string} m - Message
             * @returns {string} - Capitalized message
             */
            let $capitalize = function (m) {
                if (self.config.capitalize) {
                    return m.charAt(0).toUpperCase() + m.slice(1);
                } else {
                    return m;
                }
            };

            /**
             * Apply message format
             */
            msg = $capitalize(msg);

            /**
             * Returns formatted text
             */
            return msg;

        };

        /**
         * Extend default parameters
         * @function
         * @protected
         * @param {object=} $options - Options
         * @ignore
         */
        this._extendOptions = function ($options) {
            return Object.assign({
                closebutton: false,
                doubleTime: false,
                onclick: null,
                persistent: false,
            }, $options);
        };

        /**
         * Checks if an object is null or undefined
         * @param {object} obj - Object
         * @protected
         * @returns {boolean}
         */
        this._isNullUndf = function (obj) {
            return (obj === null || obj === undefined);
        };

    };

    /**
     * Notification class
     *
     * @class
     * @param {object=} options - Opciones de creación
     * @extends {_NotificationType}
     * @constructor
     * @private
     * @ignore
     * @since 2.8.23
     */
    let _NotificationManager = function (options) {
        _NotificationType.call(this);

        /**
         * Object pointer
         * @type {_NotificationManager}
         * @private
         * @ignore
         */
        let self = this;

        /**
         * Default parameters
         */
        let $defaults = {
            core: 'jquery-toast-plugin',    // Default
            enabled: true,                  // Notification enabled at first
            exceptionTitle: 'Exception',    // Exception notification title
            maxStack: 5,                    // Maximum notification stack, :0 infinite
            timeout: 5000,                  // Notification timeout
        };

        // Toastr exclusive configurations
        $defaults.toastr = {
            extendedTimeout: 1000,
            hideDuration: 500,
            showDuration: 300,
        };

        // AmaranJS exclusive configurations
        $defaults.amaran = {
            resetTimeout: 1000
        };

        // Extend options
        options = Object.assign($defaults, options);

        // Valid notification libraries
        let _notificationLibraries = ['toastr', 'amaranjs', 'jquery-toast-plugin'];

        /**
         * Inits notification manager
         * @function
         * @param {object=} $options - Init options
         */
        this.init = function ($options) {

            options = Object.assign(options, $options);

            /**
             * Parses user input and check if library exists
             */
            options.core = options.core.toString().toLowerCase();
            if (_notificationLibraries.indexOf(options.core) === -1) {
                console.error('notication.js: Notification library \'' + options.core + ' \' unknown');
                return;
            }

            /**
             * Init notifications
             */
            switch (options.core) {

                /**
                 * Toastr
                 * https://github.com/CodeSeven/toastr
                 */
                case 'toastr':

                    this._lastToast = null;
                    this._toastStacks = []; // Saves notification until maxStack

                    this._toastr = function ($options) {

                        // If stack overflows then removes last
                        if (self._toastStacks.length >= options.maxStack) {
                            toastr.clear(self._toastStacks[0]);
                            self._toastStacks.splice(0, 1);
                        }

                        // Extend params
                        $options = self._extendOptions($options);

                        // Variables
                        let $closebutton = false;
                        let $timeout = options.timeout;

                        // Persistent mode
                        if ($options.persistent) {
                            $closebutton = true;
                            $timeout = 0;
                        }

                        // Close button
                        if ($options.closebutton) {
                            $closebutton = true;
                        }

                        // Double time
                        /** @namespace $options.doubletime */
                        if ($options.doubletime) {
                            $timeout *= 2;
                        }

                        // Apply toastr options
                        toastr.options = {
                            'closeButton': $closebutton,
                            'extendedTimeout': options.toastr.extendedTimeout,
                            'hideDuration': options.toastr.hideDuration,
                            'hideEasing': 'linear',
                            'hideMethod': 'fadeOut',
                            'newestOnTop': false,
                            'onclick': $options.onclick,
                            'positionClass': 'toast-bottom-left',
                            'preventDuplicates': false,
                            'progressBar': true,
                            'showDuration': options.toastr.showDuration,
                            'showEasing': 'swing',
                            'showMethod': 'fadeIn',
                            'timeOut': $timeout,
                        };

                    };

                    this.clearall = function () {
                        toastr.clear();
                        self._lastToast = null;
                    };

                    this.clearlast = function () {
                        if (self._isNullUndf(self._lastToast)) {
                            toastr.clear(self._lastToast);
                        }
                    };

                    this.error = function (msg, $options) {
                        self._toastr($options);
                        self._lastToast = toastr['error'](self._format(msg));
                        self._toastStacks.push(self._lastToast);
                    };

                    this.exception = function (e, $options) {
                        self._toastr($options);
                        self._lastToast = toastr['error'](self._format(e.message), 'Exception');
                        self._toastStacks.push(self._lastToast);
                    };

                    this.info = function (msg, $options) {
                        self._toastr($options);
                        self._lastToast = toastr['info'](self._format(msg));
                        self._toastStacks.push(self._lastToast);
                    };

                    this.other = function (msg, $options) {
                        self._toastr($options);
                        self._lastToast = toastr['info'](self._format(msg));
                        self._toastStacks.push(self._lastToast);
                    };

                    this.success = function (msg, $options) {
                        self._toastr($options);
                        self._lastToast = toastr['success'](self._format(msg));
                        self._toastStacks.push(self._lastToast);
                    };

                    this.warning = function (msg, $options) {
                        self._toastr($options);
                        self._lastToast = toastr['warning'](self._format(msg));
                        self._toastStacks.push(self._lastToast);
                    };

                    break;

                /**
                 * amaranJS
                 * https://github.com/hakanersu/AmaranJS
                 */
                case 'amaranjs':

                    this.clearall = function () {
                        $.amaran({
                            'clearAll': true
                        });
                    };

                    this._amaranjs = function (msg, $options) {

                        // Content
                        let $content = {
                            message: self._format(msg)
                        };

                        // Extend params
                        $options = self._extendOptions($options);
                        let $closebutton = false;
                        let $delay = $options.timeout;
                        let $sticky = false;
                        let $onclick = function () {
                        };

                        // Persistent
                        if ($options.persistent) {
                            $closebutton = true;
                            $sticky = true;
                        }

                        // Show loading icon
                        if ($options.closebutton) {
                            $closebutton = true;
                        }

                        // Double time
                        if ($options.doubletime) {
                            $delay *= 2;
                        }

                        // Click function
                        if (!self._isNullUndf($options.onclick)) {
                            $onclick = $options.onclick;
                        }

                        // Theme
                        let $theme;
                        switch ($options.theme) {
                            case 'error':
                                $content.bgcolor = '#bd362f';
                                $content.color = '#fff';
                                $theme = 'colorful';
                                break;
                            case 'info':
                                $content.bgcolor = '#2f96b4';
                                $content.color = '#fff';
                                $theme = 'colorful';
                                break;
                            case 'other':
                                $content.bgcolor = '#a0a0a0';
                                $content.color = '#3c3c3c';
                                $theme = 'colorful';
                                break;
                            case 'success':
                                $content.bgcolor = '#51a351';
                                $content.color = '#fff';
                                $theme = 'colorful';
                                break;
                            case 'warning':
                                $content.bgcolor = '#f89406';
                                $content.color = '#fff';
                                $theme = 'colorful';
                                break;
                            default:
                                $theme = 'default';
                        }

                        // Creates amaran object
                        $.amaran({
                            clearAll: false,
                            closeButton: $closebutton,
                            closeOnClick: true,
                            content: $content,
                            cssanimationIn: false,
                            cssanimationOut: false,
                            delay: $delay,
                            inEffect: 'slideLeft',
                            onClick: $onclick,
                            outEffect: 'fadeOut',
                            overlay: false,
                            position: 'bottom left',
                            resetTimeout: options.amaran.resetTimeout,
                            sticky: $sticky,
                            stickyButton: true,
                            theme: $theme,
                            themeTemplate: null
                        });

                    };

                    this.error = function (msg, $options) {
                        $options = $.extend({theme: 'error'}, $options);
                        self._amaranjs(msg, $options);
                    };

                    this.exception = function (e, $options) {
                        $options = $.extend({theme: 'error'}, $options);
                        self._amaranjs('Exception: ' + e.message, $options);
                    };

                    this.info = function (msg, $options) {
                        $options = $.extend({theme: 'info'}, $options);
                        self._amaranjs(msg, $options);
                    };

                    this.other = function (msg, $options) {
                        $options = $.extend({theme: 'other'}, $options);
                        self._amaranjs(msg, $options);
                    };

                    this.success = function (msg, $options) {
                        $options = $.extend({theme: 'success'}, $options);
                        self._amaranjs(msg, $options);
                    };

                    this.warning = function (msg, $options) {
                        $options = $.extend({theme: 'warning'}, $options);
                        self._amaranjs(msg, $options);
                    };

                    break;

                /**
                 * jquery-toast-plugin
                 * https://github.com/kamranahmedse/jquery-toast-plugin
                 */
                case 'jquery-toast-plugin':

                    self._lastToast = null;

                    this.clearall = function () {
                        $.toast().reset('all');
                        self._lastToast = null;
                    };

                    this.clearlast = function () {
                        if (!self._isNullUndf(self._lastToast)) {
                            self._lastToast.reset();
                            self._lastToast = null;
                        }
                    };

                    this._toast = function (msg, $options) {

                        // Extend options
                        $options = self._extendOptions($options);

                        let $delay = $options.timeout;
                        let $closebutton = false;

                        // Persistent, set sticky to true
                        if ($options.persistent) {
                            $closebutton = true;
                            $delay = false;
                        }

                        // Show close icon
                        if ($options.closebutton) {
                            $closebutton = true;
                        }

                        // Double time
                        if ($options.doubletime) {
                            $delay *= 2;
                        }

                        // Opciones de creación
                        let $toastopt = {
                            allowToastClose: $closebutton,
                            hideAfter: $delay,
                            icon: 'warning',
                            loader: true,
                            position: 'bottom-left',
                            showHideTransition: 'fade', // fade,slide,plain
                            stack: $options.maxStack,
                            text: self._format(msg),
                            textAlign: 'left',
                        };

                        // Title
                        if (!self._isNullUndf($options.header)) {
                            $toastopt.heading = $options.header;
                        }

                        // Theme
                        switch ($options.theme) {
                            case 'error':
                                $toastopt.icon = 'error';
                                $toastopt.loaderBg = '#a50000';
                                break;
                            case 'info':
                                $toastopt.icon = 'info';
                                $toastopt.loaderBg = '#4858f8';
                                break;
                            case 'success':
                                $toastopt.icon = 'success';
                                $toastopt.loaderBg = '#2d7c39';
                                break;
                            case 'warning':
                                $toastopt.icon = 'warning';
                                $toastopt.loaderBg = '#ff7300';
                                break;
                            default:
                                $toastopt.bgColor = '#444444';
                                $toastopt.loaderBg = '#aeaeae';
                                $toastopt.textColor = '#eeeeee';
                                break;
                        }

                        // Init notification
                        self._lastToast = $.toast($toastopt);

                        // Click function
                        let $notification = $('.jq-toast-wrap').children();
                        let $notificationtotal = $notification.length;
                        $notification = $($notification[$notificationtotal - 1]);
                        if (!self._isNullUndf($options.onclick)) {
                            $notification.addClass('jq-notification-clickeable');
                            $notification.on('click.userFun', function () {
                                self.clearlast();
                                setTimeout($options.onclick, 100);
                            });
                        } else {
                            $notification.removeClass('jq-notification-clickeable');
                            $notification.off('click.userFun');
                        }

                    };

                    this.error = function (msg, $options) {
                        $options = $.extend({theme: 'error'}, $options);
                        self._toast(msg, $options);
                    };

                    this.exception = function (e, $options) {
                        $options = $.extend({theme: 'error', header: $options.exceptionTitle}, $options);
                        self._toast(e.message, $options);
                    };

                    this.info = function (msg, $options) {
                        $options = $.extend({theme: 'info'}, $options);
                        self._toast(msg, $options);
                    };

                    this.other = function (msg, $options) {
                        $options = $.extend({theme: 'other'}, $options);
                        self._toast(msg, $options);
                    };

                    this.success = function (msg, $options) {
                        $options = $.extend({theme: 'success'}, $options);
                        self._toast(msg, $options);
                    };

                    this.warning = function (msg, $options) {
                        $options = $.extend({theme: 'warning'}, $options);
                        self._toast(msg, $options);
                    };

                    break;

            }

        };

    };

    /**
     * Creates notification object
     * @type {_NotificationManager}
     * @global
     */
    NotificationJS = new _NotificationManager();

})();