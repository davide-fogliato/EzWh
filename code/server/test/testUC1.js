const chai = require('chai');
const chaiHttp = require('chai-http');
const PositionManager = require('../bin/controller/PositionManager');
const SKUManager = require('../bin/controller/SKUManager');
const PersistentManager = require('../bin/DB/PersistentManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);



describe('test scenarios 1-1 1-2 1-3 ', async () => {

    before(async () => {
        await PersistentManager.deleteAll("SKU");
        await PersistentManager.deleteAll("Position");
        await PositionManager.definePosition("123412341234", "1234", "1234", "1234", 100000, 100000);
        
    })
    newSKU(201, "description", 10, 10, "notes", 10, 1);
    newSKU(422, "description");
    modifyPositionOfSku(200);
    modifyWeightVolume(200, 2,2);
    modifyWeightVolume(422, 2,"err");
});




//Scenario 1-1
/*
    {
        "description" : "a new sku",
        "weight" : 100,
        "volume" : 50,
        "notes" : "first SKU",
        "price" : 10.99,
        "availableQuantity" : 50
    }
*/ 
function newSKU(expectedHTTPStatus, description, weight, volume, notes, price, availableQuantity) {
    it('adding a new SKU', async function () {
        let sku = { description: description, weight: weight, volume: volume, notes: notes, price: price, availableQuantity: availableQuantity}
        agent.post('/api/sku')
            .send(sku)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                
            });
    });
}

//Scenario 1-2
 function modifyPositionOfSku(expectedHTTPStatus) {
    it('modifying sku position', function (done) {
        agent.get('/api/skus').then(
            function (res) {
                let skuid = res.body[0].id;
                agent.get(`/api/skus/${skuid}`).then(
                    function (res) {
                        sku = res.body;
                        agent.get('/api/positions').then(
                            function (res) {
                                let positionID = res.body[0].positionID;
                                positionObj = {position: positionID};
                                agent.put(`/api/sku/${skuid}/position`).send(positionObj).then(
                                    function (res) {
                                        res.should.have.status(expectedHTTPStatus);
                                        done();
                                    }
                                )
                            }
                        )
                    }
                )
            }
        );
    })
}

//Scenario 1-3 
 function modifyWeightVolume(expectedHTTPStatus, weight, volume) {
    it('modifying sku weight and volume', function (done) {
        agent.get('/api/skus').then(
            function (res) {
                let skuid = res.body[0].id;
                agent.get(`/api/skus/${skuid}`).then(
                    function (res) {
                        sku = res.body;
                        modifiedSKU = {
                            newDescription : sku.description,
                            newWeight : weight,
                            newVolume : volume,
                            newNotes : sku.notes,
                            newPrice : sku.price,
                            newAvailableQuantity : sku.availableQuantity
                        }
                        agent.put(`/api/sku/${skuid}`).send(modifiedSKU).then(
                            function (res) {
                                res.should.have.status(expectedHTTPStatus);
                                done();
                            }
                        )
                    }
                )
            }
        );
    })
}
