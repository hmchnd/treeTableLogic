namespace my.bookshop;

entity Materials {
  key NodeID         : Int32;
      ParentNodeID   : Int32;
      DrillState     : String;
      HierarchyLevel : Int32;
      MaterialNumber : String;
      MaterialGroup : String;
      MaterialDesc  : String;
      UnitOfMeasure : String;
      UnitPrice  : Double;
      Currency : String;
      Quantity : String;
      Total : Double;
      Plant : String;
}
