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


describe('test scenarios 7-1 7-2', () => {

    before(async () => {
        await PersistentManager.deleteAll("User");

    })

    newLogin(200,"manager");
    newLogOut(200);

    function newLogin (expectedHTTPStatus,userType){
        it("test manager Login", async ()=> {
            const user = {
                username: "john",
                password: "test",
                type:userType
            }
            agent.post('/api/managerSessions')
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                
            })
        });

       
    }

    function newLogOut (expectedHTTPStatus,userType){
        it("test manager Logout", async ()=> {
            agent.post('/api/logout')
            .send()
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                
            })
        });

       
    }
    
    

});

