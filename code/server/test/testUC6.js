const chai = require('chai');
const chaiHttp = require('chai-http');
const PositionManager = require('../bin/controller/PositionManager');
const SKUManager = require('../bin/controller/SKUManager');
const UserManager = require('../bin/controller/UserManager');
const PersistentManager = require('../bin/DB/PersistentManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test scenarios 6-1 6-2', () => {

    before(async () => {
        await PersistentManager.deleteAll("ReturnOrder");

    })

//check skuitem not available
    let products = [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}]

    newReturnOrder(200,"2021/11/29 09:33",products,1)

    function newReturnOrder(expectedHTTPStatus,date,products,restockOrderId){
        it("new Return Order", async ()=> {
        
            const ro = {
                returnDate: date,
                products: products,
                restockOrderId:restockOrderId
            }
            agent.post('/api/restockOrder')
            .send(ro)
            .then(async function (res) {
                res.should.have.status(expectedHTTPStatus);
                for(let p of req.body.products){
                    await agent.get(`/api/skuitems/${p.RFID}`)
                    .send(p.RFID)
                    .then(function(res){
                        res.should.have.status(expectedHTTPStatus);
                        res.body.Available.should.equal(0);
                    })
                }
            })
        });
    }
    
    
    before(async () => {
        await PersistentManager.deleteAll("ReturnOrder");

    })

//check skuitem not available
    let products2 = [{"SKUId":12,"description":"a product","price":10.99,"RFID":"12345678901234567890123456789016"},
                    {"SKUId":180,"description":"another product","price":11.99,"RFID":"12345678901234567890123456789038"}]

    newReturnOrder(200,"2021/11/29 09:33",products2,1)

    function newReturnOrder(expectedHTTPStatus,date,products,restockOrderId){
        it("new Return Order", async ()=> {
        
            const ro = {
                returnDate: date,
                products: products,
                restockOrderId:restockOrderId
            }
            agent.post('/api/restockOrder')
            .send(ro)
            .then(async function (res) {
                res.should.have.status(expectedHTTPStatus);
                for(let p of req.body.products){
                    await agent.get(`/api/skuitems/${p.RFID}`)
                    .send(p.RFID)
                    .then(function(res){
                        res.should.have.status(expectedHTTPStatus);
                        res.body.Available.should.equal(0);
                    })
                }
            })
        });
    }
    

});

