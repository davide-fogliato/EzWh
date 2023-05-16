const chai = require('chai');
const chaiHttp = require('chai-http');
const PersistentManager = require('../bin/DB/PersistentManager');
const InternalOrderManager = require('../bin/controller/InternalOrderManager');
const InternalOrder = require('../bin/model/InternalOrder')
const utility = require('../bin/utility/utility');
const UserManager = require('../bin/controller/UserManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);
let IoId=null;




describe("test scenario 10", ()=>{

    
    before(async ()=>{
        await utility.deleteDatabase();
        const supp = await UserManager.defineUser('name','surname','pass','user@user.com','customer');
        IoId = await InternalOrderManager.defineInternalOrder("2021/11/29 09:33",
                                                            [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                                                            {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
                                                            supp)
    })



let newIO ={
    "issueDate":"2011/11/29 09:33",
    "products": [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
    "customerId" : 1
}

//postNewIo(200,newIO);

expectedObject={
    date:"2021/11/29 09:33",
    productList:[{"SKUId":12,"description":"a product","price":10.99,"qty":3},{"SKUId":180,"description":"another product","price":11.99,"qty":3}]
}
//getIo(200,IoId,expectedObject);
modifyState(200,IoId,"ACCEPTED")
let input={
    newState:"COMPLETED",
    products:[{"SkuID":1,"RFID":"12345678901234567890123456789016"},{"SkuID":1,"RFID":"12345678901234567890123456789038"}]
}
modifyState(200,IoId,input)
//deleteIO(204,IoId);
//not io found
//modifyState(404)
//validation of id failed
//modifyState(422,)

//check delete first -> post get push
function deleteIO(expectedHTTPStatus,IoId){
    it("deleteIOwithId",(done)=>{
        agent.delete(`/api/internalOrders/${IoId}`).send(IoId)
        .then(
            function(res){
                res.should.have.status(expectedHTTPStatus);
                done();
            }
        )
    })
}

function postNewIo(expectedHTTPStatus,newIO){
    it("postNewIo",(done)=>{
        agent.post('/api/internalOrders').send(newIO)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        })
    })
}

function getIo(expectedHTTPStatus,IoId,expectedObject){
    it("getIo",(done)=>{
        agent.get(`/api/internalOrders/${IoId}`).send(newIO)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            res.body.id.should.equal(IoId),
            res.body.issue_date.should.equal(expectedObject.date);
            res.body.products.should.equal(expectedObject.productList);
            
            done();
        })
    })
}


//set availablity of skuitem to 0
    function modifyState(expectedHTTPStatus,id,input){
        it('modifyState', async ()=>{ 
            if(input.newState==="COMPLETED"){
                agent.put(`/api/internalOrders/${id}`)
                .send(input)
                .then(function(res){
                    res.should.have.status(expectedHTTPStatus);
                    for(let p of req.body.products){
                        agent.get(`/api/skuitems/${p.RFID}`)
                        .send(p.RFID)
                        .then(function(res){
                            res.should.have.status(expectedHTTPStatus);
                            res.body.Available.should.equal(0);
                        })
                    }
                })             
            }
            else{
                agent.put(`/api/internalOrders/${id}`)
                .send(input.newState)
                .then(function(res){
                        res.should.have.status(expectedHTTPStatus);                 
                    }
                );  
            }                              
        });
    }
});
