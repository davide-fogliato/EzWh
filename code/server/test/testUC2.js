const chai = require('chai');
const chaiHttp = require('chai-http');
const { deletePosition } = require('../bin/controller/PositionManager');
const PositionManager = require('../bin/controller/PositionManager');
const SKUManager = require('../bin/controller/SKUManager');
const PersistentManager = require('../bin/DB/PersistentManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test scenarios 2-1 2-2 2-3 2-4 2-5 ', async () => {

    before(async () => {
        await PersistentManager.deleteAll("Position");
        
    })
    newPosition(201, "123412341234", "1234","1234","1234", 10000, 10000);
    newPosition(422, "12341234", "1234","1234","1234", 10000, 10000);
    modifyPositionID(200, "123412341234", "123412341235");
    modifyPositionID(404, "123412341231", "123412341235");
    modifyPositionID(422, "123441231", "123412341235");
    weightVolumeOfPosition(200, "123412341235", 100,100);
    weightVolumeOfPosition(404, "123412341231", 100,100);
    weightVolumeOfPosition(422, "123412341235", -10,100);
    weightVolumeOfPosition(422, "1234123412", 10,100);
    modifyAisleRowCol(200, "123412341235", "1234", "1234", "1236");
    modifyAisleRowCol(404, "123412341231", "1234", "1234", "1236");
    modifyAisleRowCol(422, "123412341235", "1234", "2", "1236");
    modifyAisleRowCol(422, "1234123412", "1234", "1234", "1236");
    delPosition(204, "123412341236")
    delPosition(422, "123412341")
    delPosition(422, "not a number")
});

//Scenario 2-1
function newPosition(expectedHTTPStatus, posID, aisleID, row, col, maxWeight, maxVolume) {
    it('adding a new Position', function (done) {
        let position = {
            positionID: posID,
            aisleID: aisleID,
            row: row,
            col: col,
            maxWeight: maxWeight,
            maxVolume: maxVolume
        }
        agent.post('/api/position')
            .send(position)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

//Scenario 2-2
function modifyPositionID(expectedHTTPStatus, oldPositionID, newPositionID) {
    it('modifying a Position ID' , function (done) {

        const newPos = {newPositionID: newPositionID};
        agent.put(`/api/position/${oldPositionID}/changeID`)
            .send(newPos)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

//Scenario 2-3
function weightVolumeOfPosition(expectedHTTPStatus, positionID, newWeight, newVolume) {
    it('modifying weight and volume', function(done) {
        agent.get('/api/positions').then(
            function (res) {
                const pos = res.body[0];
                const newPos = {
                    newAisleID: pos.aisleID,
                    newRow: pos.row,
                    newCol: pos.col,
                    newMaxWeight: newWeight,
                    newMaxVolume: newVolume,
                    newOccupiedWeight: pos.occupiedWeight,
                    newOccupiedVolume: pos.occupiedVolume
                }
                agent.put(`/api/position/${positionID}`).send(newPos).then(
                    function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }
                )
            }
        )
    })
}

//Scenario 2-4
function modifyAisleRowCol(expectedHTTPStatus, positionID, newAisle, newRow, newCol) {
    it('modifying aisle,row,col', function(done) {
        agent.get('/api/positions').then(
            function (res) {
                const pos = res.body[0];
                const newPos = {
                    newAisleID: newAisle,
                    newRow: newRow,
                    newCol: newCol,
                    newMaxWeight: pos.maxWeight,
                    newMaxVolume: pos.maxVolume,
                    newOccupiedWeight: pos.occupiedWeight,
                    newOccupiedVolume: pos.occupiedVolume
                }
                agent.put(`/api/position/${positionID}`).send(newPos).then(
                    function (res) {
                        res.should.have.status(expectedHTTPStatus);
                        done();
                    }
                )
            }
        )
    })
}

//Scenario 2-5
function delPosition(expectedHTTPStatus, positionID) {
    it('delete position', function(done) {
        agent.delete(`/api/position/${positionID}`).then(
            function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            }
        )
    })
}

