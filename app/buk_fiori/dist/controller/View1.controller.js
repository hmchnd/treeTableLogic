sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox"],function(e,t){"use strict";return e.extend("com.sap.bukfiori.controller.View1",{onInit:function(){let e=new sap.ui.model.json.JSONModel({dateValue:new Date("2023/08/15")});this.getView().setModel(e,"oDateModel");let t=new sap.ui.model.json.JSONModel;t.setData({settings:{edit:false},items:[]});this.getView().setModel(t,"oTreeModel");t.refresh(true)},date:function(e){let t=(new Date).getTimezoneOffset();let r=false;if(t>0){r=true}if(e){var i=sap.ui.core.format.DateFormat.getDateTimeInstance({format:"yyyyMMdd"});return i.format(new Date(e),r)}else{return e}},onPressTrigger:function(e){let t=this.getOwnerComponent().getModel();t.create("/trigger",{},{success:function(e){debugger},error:function(e){debugger}})},handleChange:function(e){debugger},onAddNewRow:function(){let e=this.byId("treeTable");this.onLoadDialog().open();if(e.getSelectedIndices().length>0){this.getView().getModel("oTreeModel").setProperty("/settings/edit/",true);this.onLoadDialog().setTitle("Add New Child Node");this.sMaterialGroupForNewChild=e.getContextByIndex(e.getSelectedIndices()[0]).getObject().MaterialGroup;this.ParentNodeForNewChild="";if(e.getContextByIndex(e.getSelectedIndices()[0]).getObject().ParentNodeID){this.ParentNodeForNewChild=e.getContextByIndex(e.getSelectedIndices()[0]).getObject().ParentNodeID}else{this.ParentNodeForNewChild=e.getContextByIndex(e.getSelectedIndices()[0]).getObject().NodeID}}else{this.getView().getModel("oTreeModel").setProperty("/settings/edit/",false);this.onLoadDialog().setTitle("Add New Parent Node")}this.getView().getModel("oTreeModel").refresh(true)},onAddDialogAddButtonPress:function(){let e=this.getView().getModel("oTreeModel");let t=this.byId("treeTable");let r="";if(t.getSelectedIndices().length>0){r=this.sMaterialGroupForNewChild}let i=e.getData().items;i.push({MaterialNumber:"",MaterialGroup:r,MaterialDesc:"",UnitOfMeasure:"",UnitPrice:"",Currency:"",Quantity:""});e.setProperty("/items/",i);e.refresh(true)},onDelDialogItemPress:function(e){let t=this.getView().getModel("oTreeModel");var r=e.getSource().getParent().getBindingContext("oTreeModel").getPath();var i=r.charAt(r.length-1);let o=t.getData().items;o.splice(i,1);t.setProperty("/items/",o)},onEditRow:function(){},getNewNodeID:function(){let e=this.getOwnerComponent().getModel();return new Promise(function(t,r){e.callFunction("/getNewNodeID",{urlParameters:{matGroup:""},success:function(e){t(e);debugger},error:function(e){r(e);debugger}})})},createNewEntry:function(e){let r=this.getOwnerComponent().getModel();let i=this.getView();i.setBusy(true);return new Promise(function(o,a){r.create("/Materials",e,{success:function(e){i.setBusy(false);t.success("Created");o(e);debugger},error:function(e){i.setBusy(false);a(e);debugger}})})},onAddDiaglogSave:async function(){let e;let t=false;let r;if(this.getView().getModel("oTreeModel").getData().settings.edit===false){t=true}r=this.getView().getModel("oTreeModel").getData().items;if(t){for(let t=0;t<r.length;t++){debugger;e=await this.getNewNodeID();e=e.getNewNodeID;let i={NodeID:e,ParentNodeID:null,DrillState:"expanded",HierarchyLevel:"0",MaterialNumber:"",MaterialGroup:r[t].MaterialGroup,MaterialDesc:"",UnitOfMeasure:"",UnitPrice:0,Currency:"",Quantity:"",Total:0};let o=await this.createNewEntry(i)}}else{e=await this.getNewNodeID();e=e.getNewNodeID;for(let t=0;t<r.length;t++){let i={NodeID:e,ParentNodeID:this.ParentNodeForNewChild,DrillState:"leaf",HierarchyLevel:"1",MaterialNumber:r[t].MaterialNumber,MaterialGroup:r[t].MaterialGroup,MaterialDesc:r[t].MaterialDesc,UnitOfMeasure:r[t].UnitOfMeasure,UnitPrice:parseFloat(r[t].UnitPrice),Currency:r[t].Currency,Quantity:r[t].Quantity.toString(),Total:0};let o=await this.createNewEntry(i)}}this.onLoadDialog().close()},onAddDiaglogCancel:function(){this.onLoadDialog().close();let e=this.getView().getModel("oTreeModel");e.setProperty("/items/",[])},onLoadDialog:function(){if(!this.addDialog){this.addDialog=sap.ui.xmlfragment("com.sap.bukfiori.view.NewEntry",this);this.getView().addDependent(this.addDialog)}return this.addDialog},onDownloadTemplate:function(){let e=[{MaterialNumber:"",MaterialGroup:"",MaterialDesc:"",UnitOfMeasure:"",UnitPrice:0,Currency:"",Quantity:""}];const t=XLSX.utils.json_to_sheet(e);const r=XLSX.utils.book_new();XLSX.utils.book_append_sheet(r,t);XLSX.writeFile(r,"NewTemplate.xlsx",{compression:true})},onUpload:function(e){debugger;this._import(e.getParameter("files")&&e.getParameter("files")[0])},_import:function(e){debugger;var r=this;var i={};if(e&&window.FileReader){var o=new FileReader;o.onload=function(e){var o=e.target.result;var a=XLSX.read(o,{type:"binary"});a.SheetNames.forEach(function(e){i=XLSX.utils.sheet_to_row_object_array(a.Sheets[e])});var n=i.reduce((e,t)=>{const{MaterialGroup:r}=t;e[r]=e[r]??[];e[r].push(t);return e},{});let l=Object.keys(n);let s=[];let d=0;for(let e=0;e<l.length;e++){d=d+1;let t={NodeID:d.toString(),ParentNodeID:null,DrillState:"expanded",HierarchyLevel:"0",MaterialNumber:"",MaterialGroup:l[e],MaterialDesc:"",UnitOfMeasure:"",UnitPrice:0,Currency:"",Quantity:"",Total:0};let r=t.NodeID;s.push(t);for(let t=0;t<i.length;t++){if(l[e]==i[t].MaterialGroup){d=d+1;let e={NodeID:d.toString(),ParentNodeID:r,DrillState:"leaf",HierarchyLevel:"1",MaterialNumber:i[t].MaterialNumber,MaterialGroup:i[t].MaterialGroup,MaterialDesc:i[t].MaterialDesc,UnitOfMeasure:i[t].UnitOfMeasure,UnitPrice:parseFloat(i[t].UnitPrice),Currency:i[t].Currency,Quantity:i[t].Quantity.toString(),Total:0};s.push(e)}}}let u=r.getOwnerComponent().getModel();r.getView().setBusy(true);for(let e=0;e<s.length;e++){u.create("/Materials",s[e],{success:function(t){r.getView().setBusy(false);if(e==s.length-1){sap.m.MessageToast.show("Created all 1000+ Records Successully")}},error:function(e){r.getView().setBusy(false);t.error("Error while creating Tree record")}})}};o.onerror=function(e){console.log(e)};o.readAsBinaryString(e)}}})});