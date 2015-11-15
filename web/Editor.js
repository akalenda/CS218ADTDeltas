define([
], function () {
    'use strict';

    //noinspection JSPotentiallyInvalidConstructorUsage
    var DMP = new diff_match_patch();
    var SAMPLE_CODE_FILE = 'Controller.js';

    /**
     * @param {HTMLHtmlElement} domTarget
     * @constructor
     */
    function Editor(domTarget) {

        this._oldContent = '';

        this._display = new CodeMirror(domTarget, {
            value: 'test',
            mode: 'javascript',
            theme: "pastel-on-dark",
            smartIndent: true,
            lineNumbers: true
        });
    }

    /**
     * @param {String} str
     * @returns {Editor}
     */
    Editor.prototype.setContentTo = function setContentTo(str) {
        this._display.setValue(str);
        return this;
    };

    /**
     * @returns {String}
     */
    Editor.prototype.getDeltasBetweenArchivedAndCurrentContent = function getDeltasBetweenArchivedAndCurrentContent() {
        var d = DMP.diff_main(this._oldContent, this.toString());
        DMP.diff_cleanupEfficiency(d);
        return DMP.diff_toDelta(d);
    };

    Editor.prototype.applyDeltas = function applyDeltas(deltas) {
        // TODO
    };

    /**
     * @returns {Editor}
     */
    Editor.prototype.archive = function archive() {
        this._oldContent = this.toString();
        return this;
    };

    /**
     * @returns {String}
     */
    Editor.prototype.toString = function toString() {
        return this._display.getValue();
    };

    /**
     * @returns {Editor}
     */
    Editor.prototype.empty = function clear() {
        this.setContentTo("");
        this.archive();
        return this;
    };

    /**
     * @returns {*} - a jQuery Promise that is fulfilled when sample code has been placed in the editor
     */
    Editor.prototype.reset = function reset() {
        return $.get(SAMPLE_CODE_FILE, function (fileAsString) {
            this.setContentTo("// Demo code: \n\n" + fileAsString);
            this.archive();
        }.bind(this));
    };

    return Editor;
});