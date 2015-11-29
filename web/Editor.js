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

    /**
     * @param {string} searchString
     * @param {string} replaceString
     * @returns {boolean} - True if the search-and-replacement effected a change in the actual text
     */
    Editor.prototype.searchAndReplaceAll = function searchAndReplaceAll(searchString, replaceString) {
        var oldText = this._display.getValue();
        var newText = oldText.split(searchString).join(replaceString);
        if (oldText == newText)
            return false;
        this._display.setValue(newText);
        return true;
    };

    /**
     * Adds up the values of all the characters in the document
     */
    Editor.prototype.getCharSum = function getCharSum() {
        var text = this._display.getValue();
        var sum = 0;
        for (var i = 0; i < text.length; i++) {
            sum += text.charCodeAt(i);
        }
        return sum;
    };

    /**
     * @returns {number} - returns the number of characters in the editor text
     */
    Editor.prototype.getSize = function getSize() {
        return this._display.getValue().length;
    };

    Editor.prototype.makeRandChange = function makeRandChange() {

        /* choice of add, delete, or search and replace */
        var choice = Math.random();
        var position = Math.floor(this.getSize() * Math.random());
        var randString = Math.random().toString(36);

        if (choice < 1/3) {
            var editorText = this._display.getValue();
            var output = [
                editorText.slice(0, position),
                randString,
                editorText.slice(position)
            ].join('');
            this._display.setValue(output);
            return "plainText";
        } else if (choice < 2/3) {
            var editorText = this._display.getValue();
            var deleteSize = Math.floor(20 * Math.random());
            var output = [editorText.slice(0, position), editorText.slice(position+deleteSize)].join('');
            this._display.setValue(output);
            return "plainText";
        } else {
            var editorText = this._display.getValue();
            var searchString = editorText.substring(position, position+ Math.floor(7 * Math.random() + 1));
            this.searchAndReplaceAll(searchString, randString);
            return {type: "searchAndReplace", searchString: searchString, replaceString: randString};
        }
    };

    return Editor;
});