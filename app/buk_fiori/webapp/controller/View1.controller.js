sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("com.sap.bukfiori.controller.View1", {
            onInit: function () {
                let oDateModel = new sap.ui.model.json.JSONModel({
                    dateValue: new Date("2023/08/15")
                });

                this.getView().setModel(oDateModel, "oDateModel");
                let oTreeModel = new sap.ui.model.json.JSONModel();
                oTreeModel.setData({
                    "settings": {
                        "edit": false
                    },
                    "items": [

                    ]
                });
                this.getView().setModel(oTreeModel, "oTreeModel");
                oTreeModel.refresh(true);
                this.ParentNodeForNew = null;
                this.HierarchyLevelForNew=-1;



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

                let oTreeTable = this.byId("treeTable");
                this.ParentNodeForNew = null;
                this.HierarchyLevelForNew=-1;
                this.onLoadDialog().open();
                if (oTreeTable.getSelectedIndices().length > 0) {
                 //   this.getView().getModel("oTreeModel").setProperty("/settings/edit/", true);
                    this.onLoadDialog().setTitle("Add New Child Node");
                    this.HierarchyLevelForNew = oTreeTable.getContextByIndex(oTreeTable.getSelectedIndices()[0]).getObject().HierarchyLevel;
                    this.ParentNodeForNew = oTreeTable.getContextByIndex(oTreeTable.getSelectedIndices()[0]).getObject().NodeID;

                    // if (oTreeTable.getContextByIndex(oTreeTable.getSelectedIndices()[0]).getObject().ParentNodeID) {
                    //     this.ParentNodeForNew = oTreeTable.getContextByIndex(oTreeTable.getSelectedIndices()[0]).getObject().ParentNodeID;
                    // } else {
                       
                    // }


                    // open child info
                } else {
                    this.getView().getModel("oTreeModel").setProperty("/settings/edit/", false);
                    this.onLoadDialog().setTitle("Add New Parent Node");

                    // open parent info

                }
                this.getView().getModel("oTreeModel").refresh(true);




            },
            onAddDialogAddButtonPress: function () {
                let oTreeModel = this.getView().getModel("oTreeModel");
                let oTreeTable = this.byId("treeTable");
                let matGroup = "";
                if (oTreeTable.getSelectedIndices().length > 0) {
                    matGroup = this.sMaterialGroupForNewChild;
                }
                let oTreeData = oTreeModel.getData().items;
                oTreeData.push(
                    {
                        MaterialNumber: "",
                        MaterialGroup: matGroup,
                        MaterialDesc: "",
                        UnitOfMeasure: "",
                        UnitPrice: "",
                        Currency: "",
                        Quantity: ""
                    }
                )
                oTreeModel.setProperty("/items/", oTreeData);
                oTreeModel.refresh(true);

            },
            onDelDialogItemPress: function (oEvent) {
                let oTreeModel = this.getView().getModel("oTreeModel");
                var path = oEvent.getSource().getParent().getBindingContext("oTreeModel").getPath();
                var index = path.charAt(path.length - 1);
                let oTreeData = oTreeModel.getData().items;
                oTreeData.splice(index, 1);
                oTreeModel.setProperty("/items/", oTreeData);
            },
            onEditRow: function () { },
            getNewNodeID: function () {
                let oModel = this.getOwnerComponent().getModel();

                return new Promise(function (resolve, reject) {
                    oModel.callFunction("/getNewNodeID", {
                        urlParameters: { matGroup: "" },
                        success: function (oResponse) {
                            //NewNodeID = e.getNewNodeID;
                            resolve(oResponse)
                            debugger
                        },
                        error: function (error) {
                            reject(error);
                            debugger
                        }
                    }


                    );
                })


            },
            createNewEntry: function (oPayload) {
                let oModel = this.getOwnerComponent().getModel();
                let oView = this.getView();
                oView.setBusy(true);
                return new Promise(function (resolve, reject) {
                    oModel.create("/Materials", oPayload, {

                        success: function (oResponse) {
                            oView.setBusy(false);
                            MessageBox.success("Created");
                            resolve(oResponse);
                            debugger
                        },
                        error: function (error) {
                            oView.setBusy(false);
                            reject(error);
                            debugger
                        }
                    }


                    );
                });
            },
            onAddDiaglogSave: async function () {
                let NewNodeID;
                let bisParentData = false;
                let aPayload;
                // if (this.getView().getModel("oTreeModel").getData().settings.edit === false) {
                //     bisParentData = true;

                // };
                aPayload = this.getView().getModel("oTreeModel").getData().items;

               
                for (let indexI = 0; indexI < aPayload.length; indexI++) {
                    NewNodeID = await this.getNewNodeID();
                    NewNodeID = NewNodeID.getNewNodeID;
                    
                    let oNewEntry = {
                        NodeID: Number(NewNodeID),
                        ParentNodeID:  this.ParentNodeForNew,
                        DrillState: "expanded",
                        HierarchyLevel: this.getHierarchyLevel(),
                        MaterialNumber: aPayload[indexI].MaterialNumber,
                        MaterialGroup: aPayload[indexI].MaterialGroup,
                        MaterialDesc: aPayload[indexI].MaterialDesc,
                        UnitOfMeasure: aPayload[indexI].UnitOfMeasure,
                        UnitPrice: parseFloat(aPayload[indexI].UnitPrice),
                        Currency: aPayload[indexI].Currency,
                        Quantity: aPayload[indexI].Quantity.toString(),
                        Total: 0.00
                    }
                    let oCreateResponse = await this.createNewEntry(oNewEntry);
                }



                this.onLoadDialog().close();
            },
            getParentNodeID: function (sValue) {
                if(sValue=='null'  || !sValue){
                    return null;
                }else{
                    return Number(sValue);

                }




            },
            getHierarchyLevel: function () {

                if(this.HierarchyLevelForNew==-1){
                    return 0;
                }else{
                    return Number(this.HierarchyLevelForNew)+1;
                }


            },
            onAddDiaglogCancel: function () {
                this.onLoadDialog().close();
                let oTreeModel = this.getView().getModel("oTreeModel");
                oTreeModel.setProperty("/items/", []);
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
                    Quantity: ""
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

                        // var groupedByMaterialGroup = excelData.reduce((group, arr) => {

                        //     const { MaterialGroup } = arr;

                        //     group[MaterialGroup] = group[MaterialGroup] ?? [];

                        //     group[MaterialGroup].push(arr);

                        //     return group;

                        // },

                        //     {});

                        // let groupKeys = Object.keys(groupedByMaterialGroup);
                        let treeFormatedStructure = [];
                        // let counter = 0;

                      


                            for (let indexJ = 0; indexJ < excelData.length; indexJ++) {
                               
                                   
                                    let oNewChild = {
                                        NodeID: Number(excelData[indexJ].SN),
                                        ParentNodeID: that.getParentNodeID(excelData[indexJ].PARENT),
                                        DrillState: "expanded",
                                        HierarchyLevel: Number(excelData[indexJ].LEVEL),
                                        MaterialNumber: "",
                                        MaterialGroup: "",
                                        MaterialDesc: String(excelData[indexJ].MaterialDesc),
                                        UnitOfMeasure: "",
                                        UnitPrice: 0.00,
                                        Currency: "",
                                        Quantity: "",
                                        Total: 0.00
                                    }
                                    treeFormatedStructure.push(oNewChild);
                              



                            }


                     

                        let oDataModel = that.getOwnerComponent().getModel();
                       
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
                                    MessageBox.error("Error while creating Tree record");

                                }
                            });
                        }




                    };
                    reader.onerror = function (ex) {
                        console.log(ex);
                    };
                    reader.readAsBinaryString(file);
                }
            }

        });
    });
