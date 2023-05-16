const chai = require('chai');
const chaiHttp = require('chai-http');
const ItemManager = require('../bin/controller/ItemManager');
const { deletePosition } = require('../bin/controller/PositionManager');
const PositionManager = require('../bin/controller/PositionManager');
const SKUManager = require('../bin/controller/SKUManager');
const UserManager = require('../bin/controller/UserManager');
const PersistentManager = require('../bin/DB/PersistentManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test scenarios 3-2', async () => {

    let supplierid = null;

    let products = null;
    let expectedHTTPStatus = null;
    before(async () => {
        await PersistentManager.deleteAll("RestockOrder");
        await PersistentManager.deleteAll("User");
        await PersistentManager.deleteAll("SKU");
        await PersistentManager.deleteAll("Item");
        skuid = await SKUManager.defineSKU("des",1,1,1,"notes",1);
        supplierid = await UserManager.defineUser("john", "jo", "password", "supp@supp.it", "supplier");
        item = await ItemManager.defineItem(1,"des", 1, skuid, supplierid);
        products = [{"SKUId":skuid,"description":"a product","price":10.99,"qty":30}]
        date = "2021/11/29 09:33";
        expectedHTTPStatus = 201;
    })

    it("addingRO2", async ()=> {
        
        const ro = {
            issueDate: date,
            products: products,
            supplierId: supplierid
        }
        agent.post('/api/restockOrder')
        .send(ro)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
           
        })
    });

});

