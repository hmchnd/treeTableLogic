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
                let oTreeModel = new sap.ui.model.json.JSONModel();
                this.getView().setModel(oTreeModel, "oTreeModel");



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
            onAddNewRow: function () {
                let oModel = this.getOwnerComponent().getModel();
                let NewNodeID;
                let oTreeTable = this.byId("treeTable");
                this.onLoadDialog().open();
                if (oTreeTable.getSelectedIndices().length > 0) {
                    // open child info
                } else {
                    // open parent info

                }
                // oModel.callFunction("/getNewNodeID", {
                //     urlParameters: { matGroup: "" },
                //     success: function (e) {
                //         NewNodeID = e.getNewNodeID;
                //         debugger
                //     },
                //     error: function (e) {
                //         debugger
                //     }
                // }


                // );

            },
            onEditRow: function () { },
            onAddDiaglogSave: function () {
           this.onLoadDialog().close();
            },
            onAddDiaglogCancel: function () {
                this.onLoadDialog().close();
            },
            onLoadDialog: function () {
                if (!this.addDialog) {
                    this.addDialog = sap.ui.xmlfragment(
                        "com.sap.bukfiori.view.NewEntry", this);
                    this.getView().addDependent(this.addDialog);
                }
                return this.addDialog;

            },
            onDownloadTemplate: function () {
                let rows = [{
                    MaterialNumber: "",
                    MaterialGroup: "",
                    MaterialDesc: "",
                    UnitOfMeasure: "",
                    UnitPrice: 0.00,
                    Currency: "",
                    Quantity: "",
                    Total: 0.00
                }]

                const worksheet = XLSX.utils.json_to_sheet(rows);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet);
                XLSX.writeFile(workbook, "NewTemplate.xlsx", { compression: true });
            },
            onUpload: function (e) {
                debugger
                this._import(e.getParameter("files") && e.getParameter("files")[0]);
            },

            _import: function (file) {
                debugger
                var that = this;
                var excelData = {};
                if (file && window.FileReader) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        var workbook = XLSX.read(data, {
                            type: 'binary'
                        });
                        workbook.SheetNames.forEach(function (sheetName) {
                            // Here is your object for every sheet in workbook
                            excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);

                        });

                        var groupedByMaterialGroup = excelData.reduce((group, arr) => {

                            const { MaterialGroup } = arr;

                            group[MaterialGroup] = group[MaterialGroup] ?? [];

                            group[MaterialGroup].push(arr);

                            return group;

                        },

                            {});

                        let groupKeys = Object.keys(groupedByMaterialGroup);
                        let treeFormatedStructure = [];
                        let counter = 0;

                        for (let indexI = 0; indexI < groupKeys.length; indexI++) {
                            counter = counter + 1;

                            let oNewParent = {
                                NodeID: counter.toString(),
                                ParentNodeID: null,
                                DrillState: "expanded",
                                HierarchyLevel: "0",
                                MaterialNumber: "",
                                MaterialGroup: groupKeys[indexI],
                                MaterialDesc: "",
                                UnitOfMeasure: "",
                                UnitPrice: 0.00,
                                Currency: "",
                                Quantity: "",
                                Total: 0.00
                            }
                            let currentParentNode = oNewParent.NodeID;
                            treeFormatedStructure.push(oNewParent);


                            for (let indexJ = 0; indexJ < excelData.length; indexJ++) {
                                if (groupKeys[indexI] == excelData[indexJ].MaterialGroup) {
                                    counter = counter + 1;
                                    let oNewChild = {
                                        NodeID: counter.toString(),
                                        ParentNodeID: currentParentNode,
                                        DrillState: "leaf",
                                        HierarchyLevel: "1",
                                        MaterialNumber: excelData[indexJ].MaterialNumber,
                                        MaterialGroup: excelData[indexJ].MaterialGroup,
                                        MaterialDesc: excelData[indexJ].MaterialDesc,
                                        UnitOfMeasure: excelData[indexJ].UnitOfMeasure,
                                        UnitPrice: parseFloat(excelData[indexJ].UnitPrice),
                                        Currency: excelData[indexJ].Currency,
                                        Quantity: excelData[indexJ].Quantity.toString(),
                                        Total: 0.00
                                    }
                                    treeFormatedStructure.push(oNewChild);
                                }



                            }


                        }

                        let oDataModel = that.getOwnerComponent().getModel();
                        //
                        that.getView().setBusy(true);
                        for (let indexK = 0; indexK < treeFormatedStructure.length; indexK++) {
                            oDataModel.create("/Materials", treeFormatedStructure[indexK], {
                                success: function (oResponse) {
                                    that.getView().setBusy(false);
                                    if (indexK == treeFormatedStructure.length - 1) {
                                        sap.m.MessageToast.show("Created all 1000+ Records Successully");
                                    }

                                },
                                error: function (oError) {
                                    that.getView().setBusy(false);
                                    sap.m.MessageBox.error("Error while creating Tree record");

                                }
                            });
                        }

                        // Setting the data to the local model 
                        let oTreeModel = that.getView().getModel("oTreeModel");
                        oTreeModel.setData(treeFormatedStructure);
                        oTreeModel.refresh(true);

                    };
                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                    reader.readAsBinaryString(file);
                }
            }

        });
    });
