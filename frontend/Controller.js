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
        this.sizePlainText = 0;
        //noinspection JSUnusedGlobalSymbols
        this.sizeSearchAndReplace = 0;
        //noinspection JSUnusedGlobalSymbols
        this.sizeADT = 0;

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
        this.editor_reset = function editor_reset() {
            editor.reset();
        };

        //noinspection JSUnusedGlobalSymbols
        this.deltaLog_reset = function deltaLog_reset() {
            deltaLog_plainText.reset();
            deltaLog_searchReplace.reset();
            deltaLog_ADT.reset();
            that.sizePlainText = 0;
            that.sizeSearchAndReplace = 0;
            that.sizeADT = 0;
            editor.archive();
            // TODO: Prompt server to start anew
        };

        //noinspection JSUnusedGlobalSymbols
        this.deltaLog_calculate = function deltaLog_calculate() {
            var newDeltas = editor.getDeltasBetweenArchivedAndCurrentContent();
            deltaLog_plainText.append(newDeltas);
            deltaLog_ADT.append(newDeltas);
            that.sizePlainText = deltaLog_plainText.getSize();
            that.sizeSearchAndReplace = deltaLog_searchReplace.getSize();
            that.sizeADT = deltaLog_ADT.getSize();
            editor.archive();
        };

        //noinspection JSUnusedGlobalSymbols
        this.deltaLog_sendToServer = function deltaLog_sendToServer() {
            // TODO
        };

        this.deltaLog_receiveFromServer = function deltaLog_receiveFromServer() {
            $.get("someURL", function(data){
                editor.applyDeltas(data);
            });
            // TODO
        };

        /* *************************** Initialize CodeMirrors **************************************/
        var editor = new Editor($('#editorDiv')[0]);
        editor.reset();

        var tmpDivs = $('.deltaLogDiv');
        var deltaLog_plainText     = new DeltaLog(tmpDivs[0]);
        var deltaLog_searchReplace = new DeltaLog(tmpDivs[1]);
        var deltaLog_ADT           = new DeltaLog(tmpDivs[2]);
    });
});