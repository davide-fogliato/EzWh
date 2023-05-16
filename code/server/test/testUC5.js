const chai = require('chai');
const chaiHttp = require('chai-http');
const PositionManager = require('../bin/controller/PositionManager');
const SKUManager = require('../bin/controller/SKUManager');
const UserManager = require('../bin/controller/UserManager');
const PersistentManager = require('../bin/DB/PersistentManager');
const SKUItemManager = require('../bin/controller/SKUItemManager');
chai.use(chaiHttp);
chai.should();
const utility = require('../bin/utility/utility');

const app = require('../server');
const { expect } = require('chai');
const RestockOrderManager = require('../bin/controller/RestockOrderManager');
const ItemManager = require('../bin/controller/ItemManager');
const QualityTestManager = require('../bin/controller/QualityTestManager');
var agent = chai.request.agent(app);


describe('test scenario 5-1-1', () => {
    let skuid = null;
    let supplierid = null;
    let item = null;
    let products = null;
    let date = null;
    let rfid = null;
    let roid = null;
    beforeEach(async () => {
        
        await PersistentManager.deleteAll("RestockOrder");
        await PersistentManager.deleteAll("User");
        await PersistentManager.deleteAll("SKU");
        await PersistentManager.deleteAll("Item");
        await PersistentManager.deleteAll("SKUItem");
        skuid = await SKUManager.defineSKU("des",1,1,1,"notes",1);
        supplierid = await UserManager.defineUser("john", "jo", "password", "supp@supp.it", "supplier");
        item = await ItemManager.defineItem(1,"des", 1, skuid, supplierid);
        products = [{"SKUId":skuid,"itemId":1, "description":"a product","price":10.99,"qty":1}]
        date = "2021/11/29 09:33";
        roid = await RestockOrderManager.defineRestockOrder(date, products, supplierid);
        await RestockOrderManager.modifyState(roid, "DELIVERY");
        rfid = "40311480885985959917534647794760";
    })

    updateRestockOrder(201, 200, "DELIVERED")
    updateRestockOrderInvalid(201, 422, "wrongField", roid)
    updateRestockOrderInvalid(201, 422, "wrongField", roid)
    updateRestockOrderInvalid(201, 422, "DELIVERED", -1)
    updateRestockOrderInvalid(201, 422, "DELIVERED", "not a number")


    function updateRestockOrder(expectedHTTPStatusSKUItem, expectedHTTPStatus, state) {
        it('updating Delivered state', function (done) {
            const newState = {newState: state}
            const skuitem = {
                RFID: rfid,
                SKUId: skuid, 
                DateOfStock: date
            }
                agent.post('/api/skuitem').send(skuitem).then(
                    function (res) {
                        res.should.have.status(expectedHTTPStatusSKUItem);
                        agent.put(`/api/restockOrder/${roid}`).send(newState).then(
                            function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done()
                            }
                        )
                    }
                )
                    
        })
    }

    function updateRestockOrderInvalid(expectedHTTPStatusSKUItem, expectedHTTPStatus, state, rid) {
        it('updating Delivered state invalid', function (done) {
            const newState = {newState: state}
            const skuitem = {
                RFID: rfid,
                SKUId: skuid, 
                DateOfStock: date
            }
                agent.post('/api/skuitem').send(skuitem).then(
                    function (res) {
                        res.should.have.status(expectedHTTPStatusSKUItem);
                        agent.put(`/api/restockOrder/${rid}`).send(newState).then(
                            function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            }
                        )
                    }
                )
                    
        })
    }
})

describe('test scenario 5-2-1 5-2-2 5-2-3', () => {
    let skuid = null;
    let supplierid = null;
    let item = null;
    let products = null;
    let date = null;
    let rfid = null;
    let roid = null;
    beforeEach(async () => {
        
        await PersistentManager.deleteAll("RestockOrder");
        await PersistentManager.deleteAll("User");
        await PersistentManager.deleteAll("SKU");
        await PersistentManager.deleteAll("Item");
        await PersistentManager.deleteAll("SKUItem");
        skuid = await SKUManager.defineSKU("des",1,1,1,"notes",1);
        supplierid = await UserManager.defineUser("john", "jo", "password", "supp@supp.it", "supplier");
        item = await ItemManager.defineItem(1,"des", 1, skuid, supplierid);
        products = [{"SKUId":skuid,"itemId":1,"description":"a product","price":10.99,"qty":1}]
        date = "2021/11/29 09:33";
        roid = await RestockOrderManager.defineRestockOrder(date, products, supplierid);
        await RestockOrderManager.modifyState(roid, "DELIVERED");
        rfid = "40311480885985959917534647794760";
    })

    updateRestockOrderTested(200, "TESTED")
    updateRestockOrderInvalidTested(422, "wrongField", roid)
    updateRestockOrderInvalidTested(422, "wrongField", roid)
    updateRestockOrderInvalidTested(422, "TESTED", -1)
    updateRestockOrderInvalidTested(422, "TESTED", "not a number")


    function updateRestockOrderTested(expectedHTTPStatus, state) {
        it('updating Delivered state to tested', function (done) {
            const newState = {newState: state}
            agent.put(`/api/restockOrder/${roid}`).send(newState).then(
                function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }
                
            )
                    
        })
    }

    function updateRestockOrderInvalidTested(expectedHTTPStatus, state, rid) {
        it('updating Delivered state to tested invalid', function (done) {
            const newState = {newState: state}
            agent.put(`/api/restockOrder/${rid}`).send(newState).then(
                function (res) {
                    res.should.have.status(expectedHTTPStatus);
                    done();
                }
            )
                    
        })
    }
})

describe('test scenarios 5.3', () => {
    let sku_id = null;
    let products = null;
    let ro_id = null;
    let rfids = [];
    let pos_id = null;
    let position = null;
    let sku = null;
    let test_id_neg = null;
    let test_id_pos = null;
    let test_neg = null;
    let test_pos = null;

    before(async () => {
    
        await utility.deleteDatabase();
  
        sku_id = await SKUManager.defineSKU("des",1,1,1,"notes",0);
        rfids = ["12341234123412341234123412341234","12341234123412341234123412341235"];
        await SKUItemManager.defineSKUItem(rfids[0],sku_id,"2021/11/29");
        await SKUItemManager.defineSKUItem(rfids[1],sku_id,"2021/11/29");
        products = [{"SKUId":sku_id,"itemId":2,"description":"a product","price":10.99,"qty":2}]
        supp = await UserManager.defineUser('j','j','pass','user@user.com','supplier');
        await ItemManager.defineItem(2,"des",10, sku_id,supp);
        
        pos_id = "123412341234";
        await PositionManager.definePosition( "123412341234", "1234","1234","1234", 10000, 10000);
        await SKUManager.setPosition(sku_id, "123412341234");
        position = await PersistentManager.loadOneByAttribute("id","Position",pos_id);
   
        sku = await PersistentManager.loadOneByAttribute("id","SKU",sku_id);
        testDes = await QualityTestManager.defineTestDescriptor('name','proc',sku_id);
        test_id_pos =await QualityTestManager.defineTestResult(rfids[0],"2021/11/29",1,testDes);
        test_id_neg =await QualityTestManager.defineTestResult(rfids[1],"2021/11/29",0,testDes);
        test_pos = await PersistentManager.loadOneByAttribute("id","TestResult",test_id_pos);
        test_neg = await PersistentManager.loadOneByAttribute("id","TestResult",test_id_neg);
    })
    
    stockSKUItems(200, ro_id, rfids[0]);
    stockSKUItems(422, -1, rfids[0]);
    stockSKUItems(404, "positive not existent", rfids[0]);
    StockZeroItem(200, 1);
    StockZeroItem(422, -1);
    StockZeroItem(404, "positive not existing");

    

//Scenario 5-3-1
function stockSKUItems(expectedHTTPStatus,id, rfids) {
   
    it('stock skuItems', async function () {
        
        ro_id = await RestockOrderManager.defineRestockOrder("2021/11/29 09:33", products, supp);
        await RestockOrderManager.modifyState(ro_id,"TESTED");
        if (id === -1) {
            ro_id = -ro_id;
        }
        if (id === "positive not existent") {
            ro_id = 100000000;
        }
        rfids = ["12341234123412341234123412341234","12341234123412341234123412341235"];
        let newPos = {
            "newAisleID": position.aisle,
            "newRow": position.row,
            "newCol": position.col,
            "newMaxWeight": position.max_weight,
            "newMaxVolume": position.max_volume,
            "newOccupiedWeight": position.max_weight - rfids.length * sku.weight,
            "newOccupiedVolume":position.max_volume - rfids.length * sku.volume
        }
        let newSku = {
            "newDescription" : sku.description,
            "newWeight" : sku.weight,
            "newVolume" : sku.volume,
            "newNotes" : sku.notes,
            "newPrice" : sku.price,
            "newAvailableQuantity" : sku.availableQuantity + rfids.length
        }
        const newState = {newState: "COMPLETED"}  
        await agent.put(`/api/position/${pos_id}`)
            .send(newPos)
            .then(async function (res) {
                res.should.have.status(200);
                await agent.put(`/api/sku/${sku_id}`)
                .send(newSku)
                    .then(async function (res) {
                        res.should.have.status(200);
                        await agent.put(`/api/restockOrder/${ro_id}`).send(newState).then(
                            
                            function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                
                    })    
            })
        })        
    });
}


//Scenario 5-3-2
function StockZeroItem(expectedHTTPStatus, id) {
    
        
        it('stock zero SKU items of a RO', async function () {
            ro_id = await RestockOrderManager.defineRestockOrder("2021/11/29 09:33", products, supp);
        
        await RestockOrderManager.modifyState(ro_id,"TESTED");
        if (id === -1) {
            ro_id = -ro_id;
        }
        if (id === "positive not existent") {
            ro_id = 100000000;
        }
            ro_id = await RestockOrderManager.defineRestockOrder("2021/11/29 09:33", products, supp);
            await RestockOrderManager.modifyState(ro_id,"TESTED");
            if (id == -1) {
                ro_id = -ro_id;
            }
            if (id == "positive not existing") {
                ro_id = 10000000;
            }
            if(test_neg.Result==0){
            const newState = {newState: "COMPLETEDRETURN"}       
            await agent.put(`/api/restockOrder/${ro_id}`).send(newState).then(
                function (res) {
                res.should.have.status(expectedHTTPStatus);
                
            }) 
            }   
        })
}
                
StockSomeItem(200, ro_id, rfids[0]);
StockSomeItem(422, -1, rfids[0]);
StockSomeItem(404, "positive not existent",rfids[0]);
        //Scenario 5-3-3
function StockSomeItem(expectedHTTPStatus, id, rfids) {

    it('Stock some SKU items of a RO', async function () {
        rfids = ["12341234123412341234123412341234","12341234123412341234123412341235"];
    ro_id = await RestockOrderManager.defineRestockOrder("2021/11/29 09:33", products, supp);
    await RestockOrderManager.modifyState(ro_id,"TESTED");
    if (id === -1) {
        ro_id = -ro_id;
    }
    if (id === "positive not existent") {
        ro_id = 100000000;
    }
        if(test_pos.Result==1 && test_neg.Result==0){
        let newPos = {
            "newAisleID": position.aisleID,
            "newRow": position.row,
            "newCol": position.col,
            "newMaxWeight": position.maxWeight,
            "newMaxVolume": position.maxVolume,
            "newOccupiedWeight": position.occupiedWeight - rfids.length * sku.weight,
            "newOccupiedVolume":position.occupiedVolume - rfids.length * sku.volume
        }
        let newSku = {
            "newDescription" : sku.description,
            "newWeight" : sku.weight,
            "newVolume" : sku.volume,
            "newNotes" : sku.notes,
            "newPrice" : sku.price,
            "newAvailableQuantity" : sku.availableQuantity + rfids.length
        }
        const newState = {newState: "COMPLETEDRETURN"}  
             
        agent.put(`/api/position/${pos_id}`)
            .send(newPos)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                agent.put(`/api/sku/${sku_id}`)
                .send(newSku)
                    .then(function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        agent.put(`/api/restockOrder/${id}`).send(newState).then(
                            function (res) {
                                res.should.have.status(expectedHTTPStatus);
                             
                    })    
            })
        }) 
    }       
    });
}
});




