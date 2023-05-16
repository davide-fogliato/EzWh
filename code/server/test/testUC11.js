const chai = require('chai');
const chaiHttp = require('chai-http');
const ItemManager = require('../bin/controller/ItemManager');
const UserManager = require('../bin/controller/UserManager');
const SKUManager = require('../bin/controller/SKUManager');
const PersistentManager = require('../bin/DB/PersistentManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const { expect, use } = require('chai');
var agent = chai.request.agent(app);

let sku_id1 = null;
let user_id = null;

describe('test scenarios 11-1 11-2', () => {

    before(async () => {
        
        await PersistentManager.deleteAll("Item");
        await PersistentManager.deleteAll("User");
        await PersistentManager.deleteAll("SKU");
        sku_id1 = await SKUManager.defineSKU("des 1",1,1,1,"notes",1);
        user_id = await UserManager.defineUser("john", "jo", "password", "supp@supp.it", "supplier");
     
        
    })
    
    newItem(201, 1,"description", 12.14, 1, 1);
    newItem(422, 3,"description", "invalid price", 1, 1);
    newItem(422, 4,"description", 12.14, "invalid SKUId", 1);
    newItem(422, 5,"description", 12.14, 1, "invalid supplierId");
    newItem(422, 6,"description", -12.14, 1, 1);
    newItem(422, 7,"description", 12.14, -1, 1);
    newItem(422, 8,"description", 12.14, 1, -1);
    //same sku_id and user_id of an existing item
    newItem(422, 9,"description", 12.14, 1, 1);
    newItem(404, 10,"description", 12.14, 100000, 1);
    newItem(404, 11,"description", 12.14, 1, 100000);

    modifyItem(200, 1, 1, "new description", 10.11);
    modifyItem(422, 1, 1, "new description", "invalid new price");
    modifyItem(422, "invalid id", 1, "new description", 10.11);
    modifyItem(422, -1, 1, "new description", 10.11);
    modifyItem(422, 1, 1, "new description", -10.11);
    modifyItem(404, 1000, 1, "new description", 10.11);
    

});

//Scenario 11-1
function newItem(expectedHTTPStatus,id, description, price, SKUId, supplierId) {
    it('adding a new Item', function (done) {
        if(supplierId == 1){
            supplierId = user_id;
        }
        if(SKUId == 1){
            SKUId = sku_id1;
        }
        const item = {
            id: id,
            description: description,
            price: price,
            SKUId: SKUId,
            supplierId: supplierId
        }
        agent.post('/api/item')
            .send(item)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

//Scenario 11-2
 function modifyItem(expectedHTTPStatus, id, supplierId, newDescription, newPrice) {
    it('modifying Item by Id' , function (done) {

        if(supplierId == 1){
            supplierId = user_id;
        }
        
        const newItem = {newDescription: newDescription, newPrice: newPrice};
        agent.put(`/api/item/${id}/${supplierId}`)
            .send(newItem)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


