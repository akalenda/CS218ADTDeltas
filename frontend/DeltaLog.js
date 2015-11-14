define([
], function() {
    'use strict';

    /**
     * @param {HTMLHtmlElement} domTarget
     * @constructor
     */
    function DeltaLog(domTarget) {

        this._deltas = [];
        this._size = 0;

        this._display = new CodeMirror(domTarget, {
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
        this._deltas = [];
        this._size = 0;
        this._display.setValue("");
        this._display.clearHistory();
        return this;
    };

    /**
     * @param {String} delta
     * @param {String} [type]
     * @returns {DeltaLog}
     */
    DeltaLog.prototype.append = function append(delta, type) {
        this._deltas.push(delta);
        this._size += delta.length;
        this._display.replaceRange(delta + "\n", CodeMirror.Pos(this._display.lastLine()));
        return this;
    };

    /**
     * @returns {String}
     */
    DeltaLog.prototype.toString = function toString() {
        var stringification = "";
        this._deltas.forEach(function(delta){
            stringification += delta;
        });
        return stringification;
    };

    /**
     * @returns {number|Number}
     */
    DeltaLog.prototype.getSize = function getSize() {
        return this._size;
    };

    return DeltaLog;
});