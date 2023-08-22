namespace my.bookshop;

entity Materials {
  key NodeID         : String;
      ParentNodeID   : String;
      DrillState     : String;
      HierarchyLevel : String;
      MaterialNumber : String;
      MaterialGroup : String;
      MaterialDesc  : String;
      UnitOfMeasure : String;
      UnitPrice  : Double;
      Currency : String;
      Quantity : String;
      Total : Double;
}
