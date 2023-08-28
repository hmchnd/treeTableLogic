using my.bookshop as my from '../db/data-model';

service CatalogService {
    entity Materials as projection on my.Materials;
    function getNewNodeID(matGroup:String) returns String;
 
}

