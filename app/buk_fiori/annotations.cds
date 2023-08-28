using CatalogService as service from '../../srv/cat-service';

annotate service.Materials {
    NodeID @sap.hierarchy.node.for;
    HierarchyLevel @sap.hierarchy.level.for;
    ParentNodeID @sap.hierarchy.parent.node.for;
    DrillState @sap.hierarchy.drill.state.for;
}