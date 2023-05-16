const chai = require('chai');
const chaiHttp = require('chai-http');
const QualityCheckManager = require('../bin/controller/QualityTestManager');
const SKUManager = require('../bin/controller/SKUManager');
const PersistentManager = require('../bin/DB/PersistentManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);

let sku_id = null;
let test_id = null;


describe('test scenarios 12-1 12-2 12-3', () => {

    before(async () => {
        await PersistentManager.deleteAll("TestDescriptor");
        await PersistentManager.deleteAll("SKU");
        sku_id = await SKUManager.defineSKU("description",1,1,1,"notes",1);
        test_id = await QualityCheckManager.defineTestDescriptor("name","procedure test",sku_id);
        
    })
   
    newTestDescriptor(201, "name", "procedure", 1);
    newTestDescriptor(422, "name", "procedure", "invalid idSKU");
    newTestDescriptor(422, "name", "procedure", -1);
    newTestDescriptor(404, "name", "procedure", 100000);

    modifyTestDescription(200, 1, "new procedure");
    modifyTestDescription(422, "invalid id", "new procedure");
    modifyTestDescription(422, -1, "new procedure");
    modifyTestDescription(404, 100000, "new procedure");

    deleteTestDescriptor(204, 1);
    deleteTestDescriptor(422, "invaid id");
    deleteTestDescriptor(422, -2);
    
});

//Scenario 12-1
function newTestDescriptor(expectedHTTPStatus, name, procedureDescription, idSKU) {
    it('adding a new Test Descriptor', function (done) {
        if(idSKU == 1){
            idSKU = sku_id;
        }
        let testDescriptor = {
            name: name,
            procedureDescription: procedureDescription,
            idSKU: idSKU
        }
        agent.post('/api/testDescriptor')
            .send(testDescriptor)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

//Scenario 12-2
 function modifyTestDescription(expectedHTTPStatus, id, newProcedureDescription) {
    it('modifying Test Descriptor by Id' , function (done) {
        if(id == 1){
            id = test_id;
        }
        const newTestDescriptor = {
            newName: "name",
            newProcedureDescription: newProcedureDescription, 
            newIdSKU: sku_id
        }
        agent.put(`/api/testDescriptor/${id}`)
        .send(newTestDescriptor)
        .then(function (res) {
            res.should.have.status(expectedHTTPStatus);
            done();
        })
    });
}

//Scenario 12-3
 function deleteTestDescriptor(expectedHTTPStatus, id) {
    it('delete Test Descriptor', function(done) {
        if(id == 1){
            id = test_id;
        }
        agent.delete(`/api/testDescriptor/${id}`).then(
            function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }
        )
    })
}

