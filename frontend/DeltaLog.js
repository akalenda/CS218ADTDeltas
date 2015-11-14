define([
], function() {
    'use strict';

    /**
     * @param {HTMLHtmlElement} domTarget
     * @constructor
     */
    function DeltaLog(domTarget) {

        this._display = new CodeMirror(document.body, {
            value       : '',
            mode        : 'diff',
            theme       : "pastel-on-dark",
            smartIndent : true,
            lineNumbers : true,
            readOnly    : true
        });
    }

    /**
     * @returns {DeltaLog}
     */
    DeltaLog.prototype.reset = function reset() {
        this._display.setValue("");
        this._display.clearHistory();
        return this;
    };

    /**
     * @param {String} str
     * @returns {DeltaLog}
     */
    DeltaLog.prototype.append = function append(str) {
        this._display.replaceRange(str, CodeMirror.Pos(this._display.lastLine()));
        return this;
    };

    /**
     * @returns {String}
     */
    DeltaLog.prototype.toString = function toString() {
        return this._display.value;
    };

    return DeltaLog;
});