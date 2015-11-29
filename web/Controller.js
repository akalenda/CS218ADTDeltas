define([
    'jquery',
    'DeltaLog',
    'Editor'
], function ($, DeltaLog, Editor) {
    'use strict';

    var module = angular.module('ADTDeltaProject', []);

    angular.element(document).ready(function () {
        angular.bootstrap(document, ['ADTDeltaProject']);
    });

    /**
     *
     */
    module.controller('Controller', function ControllerConstructor() {

        var that = this;

        /* *************************** Angular fields *******************************************/
        //noinspection JSUnusedGlobalSymbols
        this.sizeEditorText = 0;
        //noinspection JSUnusedGlobalSymbols
        this.sizePlainText = 0;
        //noinspection JSUnusedGlobalSymbols
        this.sizeSearchAndReplace = 0;
        this.sizeADT = 0;

        /**
         * Updates values that are displayed (via Angular's $digest) on the webpage
         */
        function updateLogSizeDisplays() {
            that.sizeEditorText = editor.getSize();
            that.sizePlainText = deltaLog_plainText.getSize();
            that.sizeSearchAndReplace = deltaLog_searchReplace.getSize();
            that.sizeADT = deltaLog_ADT.getSize();
        }

        /**
         * Updates values that are displayed (via Angular's $digest) on the webpage
         */
        function resetLogSizeDisplays() {
            that.sizePlainText = 0;
            that.sizeSearchAndReplace = 0;
            that.sizeADT = 0;
        }

        /* *************************** Angular button functions **************************************************/

        //noinspection JSUnusedGlobalSymbols
        this.system_reset = function system_reset() {
            this.editor_reset();
            this.deltaLog_reset();
        };

        //noinspection JSUnusedGlobalSymbols
        this.editor_clear = function editor_empty() {
            editor.clear();
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         *
         */
        this.editor_reset = function editor_reset() {
            editor.reset();
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * Prompt the editor to highlight
         * @param {string} searchString
         */
        this.editor_findNext = function editor_findNext(searchString) {
            // TODO
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         * @param {string} searchString
         * @param {string} replaceString
         */
        this.editor_searchAndReplaceAll = function editor_searchAndReplaceAll(searchString, replaceString) {
            if (!searchString.length || searchString.length == 0 || searchString == replaceString)
                return;
            this.deltaLog_calculate();
            var changeOccurred = editor.searchAndReplaceAll(searchString, replaceString);
            if (!changeOccurred)
                return;
            searchAndReplaceHelper(searchString, replaceString);
        };

        /**
         *
         */
        this.deltaLog_reset = function deltaLog_reset() {
            deltaLog_plainText.reset();
            deltaLog_searchReplace.reset();
            deltaLog_ADT.reset();
            resetLogSizeDisplays();
            editor.archive();
            // TODO: Prompt server to start anew
        };

        /**
         *
         */
        this.deltaLog_calculate = function deltaLog_calculate() {
            var newDeltas = editor.getDeltasBetweenArchivedAndCurrentContent();
            if (noChangeIsDescribedIn(newDeltas))
                return;
            deltaLog_plainText.append(makeTimestamp() + newDeltas);
            if (that.sizeADT == 0)
                deltaLog_ADT.append(makeTimestamp());
            deltaLog_ADT.append(newDeltas);
            updateLogSizeDisplays();
            editor.archive();
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         *
         */
        this.deltaLog_sendToServer = function deltaLog_sendToServer() {
            $.post("/plainTextDelta", { d: deltaLog_plainText.toString() }, function(response){
                alert(response);
            });
        };

        //noinspection JSUnusedGlobalSymbols
        /**
         *
         */
        this.deltaLog_receiveFromServer = function deltaLog_receiveFromServer() {
            $.get("/plainTextDelta", function(data){
                alert(data);
                //editor.applyDeltas(data);
            });
            // TODO
        };

        this.deltaLog_generateRandDelta = function deltaLog_generateRandDelta() {
            var choiceDelta = editor.makeRandChange();
            if (choiceDelta == "plainText"){
                this.deltaLog_calculate();
            } else if (choiceDelta.type == "searchAndReplace") {
                searchAndReplaceHelper(choiceDelta.searchString, choiceDelta.replaceString);
            }

        };

        /* *************************** Initialize CodeMirrors **************************************/
        var editor = new Editor($('#editorDiv')[0]);

        var tmpDivs = $('.deltaLogDiv');
        var deltaLog_plainText     = new DeltaLog(tmpDivs[0]);
        var deltaLog_searchReplace = new DeltaLog(tmpDivs[1]);
        var deltaLog_ADT           = new DeltaLog(tmpDivs[2]);

        this.system_reset();

        /* ************************* Helper functions **********************************/
        /**
         * @param {string} str
         * @returns {string}
         */
        function encodeSpecialCharactersIn(str) {
            return str.split("%").join("%09")
                .split("\t").join("%13");
        }

        //noinspection JSUnusedLocalSymbols
        /**
         * @param {string} str
         * @returns {string}
         */
        function decodeSpecialCharactersIn(str) {
            return str.split("%13").join("\t")
                .split("%09").join("%");
        }

        /**
         * @param {string} delta
         * @returns boolean
         */
        function noChangeIsDescribedIn(delta) {
            return /^=\d+$/.test(delta);
        }

        /**
         * @returns {string} - The current date-time, in milliseconds, encoded in base-36
         */
        function makeTimestamp() {
            return Date.now().toString(36);
        }

        function searchAndReplaceHelper(searchString, replaceString) {
            var searchString2 = encodeSpecialCharactersIn(searchString);
            var replaceString2 = encodeSpecialCharactersIn(replaceString);
            var delta = "=r\t" + searchString2 + "\t" + replaceString2 + "\t=" + editor.getCharSum();
            deltaLog_searchReplace.append(makeTimestamp() + delta);
            if (that.sizeADT == 0)
                deltaLog_ADT.append(makeTimestamp());
            deltaLog_ADT.append(delta);
            updateLogSizeDisplays();
            editor.archive();
        }
    });
});