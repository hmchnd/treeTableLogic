sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("com.sap.bukfiori.controller.View1", {
            onInit: function () {
                let oDateModel = new sap.ui.model.json.JSONModel({
                    dateValue: new Date("2023/08/15")
                });

                this.getView().setModel(oDateModel, "oDateModel");



            }, date: function (value) {
                let offset = new Date().getTimezoneOffset();
                let bUTC = false;
                if (offset > 0) {
                    bUTC = true;
                }
                if (value) {
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        format: 'yyyyMMdd'
                    });
                    return oDateFormat.format(new Date(value), bUTC);
                } else {
                    return value;
                }
            },
            onPressTrigger: function (oEvent) {
                let oModel = this.getOwnerComponent().getModel();
                oModel.create("/trigger", {}, {

                    success: function (oResponse) {
                        debugger
                    },
                    error: function (oError) {
                        debugger
                    }
                })

            },
            handleChange: function (oEvent) {
                debugger
            },
            onAddNewRow: function () { },
            onEditRow: function () { },
            onDeleteRow: function () { },
            onUploadExcel: function () {

            }

        });
    });
