const chai = require('chai');
const chaiHttp = require('chai-http');
const PersistentManager = require('../bin/DB/PersistentManager');
const InternalOrderManager = require('../bin/controller/InternalOrderManager');
const InternalOrder = require('../bin/model/InternalOrder')
const utility = require('../bin/utility/utility');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
const UserManager = require('../bin/controller/UserManager');
var agent = chai.request.agent(app);
let IoId=null;


describe("test scenario 9-1 9-2 9-3", ()=>{
    
    
    beforeEach(async ()=>{
        await utility.deleteDatabase();
        
    })





modifyIOState(200,"ACCEPTED")
modifyIOState(200,"CANCELED")
modifyIOState(200,"REFUSED")




//set availablity of skuitem to 0
    function modifyIOState(expectedHTTPStatus,newState){
        it('modifyIOState', async function () { 
            const supp = await UserManager.defineUser('name','surname','pass','user@user.com','customer');
        
        id = await InternalOrderManager.defineInternalOrder("2021/11/29 09:33",
                                                            [{"SKUId":12,"description":"a product","price":10.99,"qty":3},
                                                            {"SKUId":180,"description":"another product","price":11.99,"qty":3}],
                                                            supp)
            const b = {
                newState: newState
            } 
            await agent.put(`/api/internalOrders/${id}`)
            .send(b)
            .then(  async function(res){
                    res.should.have.status(expectedHTTPStatus);                 
                    await agent.get(`/api/internalOrders/${id}`)
                    .then(function(res2){
                        res2.should.have.status(expectedHTTPStatus);
                        
                    });
                }
            ); 


                            
        });
    }
});
