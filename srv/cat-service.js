const cds = require('@sap/cds');

module.exports = async srv => {
    const { Materials } = cds.entities('my.bookshop');
    srv.on("getNewNodeID", async function (req) {
        let response = await SELECT.one.from(Materials).columns(`count(*) as maxId`);
        response.maxId = response.maxId+1;
        return response.maxId.toString();

    });



}