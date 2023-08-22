/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/Device",
    "com/sap/bukfiori/model/models"
],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("com.sap.bukfiori.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                var jQueryScript = document.createElement('script');
                jQueryScript.setAttribute('src', 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js');
                document.head.appendChild(jQueryScript);


                var jQueryScript = document.createElement('script');
                jQueryScript.setAttribute('src', 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js');
                document.head.appendChild(jQueryScript);
            }
        });
    }
);