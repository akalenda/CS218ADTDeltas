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
    module.controller('EditorController', function editorConstructor() {

        /* *************************** Button functions **************************************************/
        this.editor_clear = function editor_empty(){ editor.clear(); };
        this.editor_reset = function editor_reset(){ editor.reset(); };

        this.deltaLog_reset = function deltaLog_reset() {
            editor.archive();
            deltaLog.reset();
            // TODO: Prompt server to start anew
        };

        this.deltaLog_calculate = function deltaLog_calculate() {
            // TODO
        };

        this.deltaLog_sendToServer = function deltaLog_sendToServer() {
            // TODO
        };

        /* ***************************  **************************************/
        var editor = new Editor($('#editorDiv')[0]);
        editor.reset();

        var deltaLog = new DeltaLog($('#deltaLogDiv')[0]);
    });
});