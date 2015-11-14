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
     */
    module.controller('Controller', function ControllerConstructor() {

        var that = this;

        /* *************************** Angular fields *******************************************/
        this.sizePlainText = 0;
        this.sizeSearchAndReplace = 0;
        this.sizeADT = 0;

        /* *************************** Button functions **************************************************/

        this.system_reset = function system_reset() {
            this.editor_reset();
            this.deltaLog_reset();
        };

        this.editor_clear = function editor_empty() {
            editor.clear();
        };

        this.editor_reset = function editor_reset() {
            editor.reset();
        };

        this.deltaLog_reset = function deltaLog_reset() {
            deltaLog_plainText.reset();
            deltaLog_searchReplace.reset();
            deltaLog_ADT.reset();
            editor.archive();
            // TODO: Prompt server to start anew
        };

        this.deltaLog_calculate = function deltaLog_calculate() {
            var newDeltas = editor.getDeltasBetweenArchivedAndCurrentContent();
            deltaLog_plainText.append(newDeltas);
            deltaLog_ADT.append(newDeltas);
            that.sizePlainText = deltaLog_plainText.getSize();
            that.sizeSearchAndReplace = deltaLog_searchReplace.getSize();
            that.sizeADT = deltaLog_ADT.getSize();
            editor.archive();
        };

        this.deltaLog_sendToServer = function deltaLog_sendToServer() {
            // TODO
        };

        /* ***************************  **************************************/
        var editor = new Editor($('#editorDiv')[0]);
        editor.reset();

        var tmpDivs = $('.deltaLogDiv');
        var deltaLog_plainText     = new DeltaLog(tmpDivs[0]);
        var deltaLog_searchReplace = new DeltaLog(tmpDivs[1]);
        var deltaLog_ADT           = new DeltaLog(tmpDivs[2]);
    });
});