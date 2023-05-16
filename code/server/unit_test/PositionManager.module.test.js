
const PersistentManager = require('../bin/DB/PersistentManager');
const PositionManager = require('../bin/controller/PositionManager');
const SKUManager = require('../bin/controller/SKUManager');

const utility = require("../bin/utility/utility");

describe('Position tests', () => {

    positionID = "123412341234";
    aisleID = "1234";
    row = "1234";
    col = "1234";
    maxWeight = 1000;
    maxVolume = 1000;

    positionTests(positionID, aisleID, row, col, maxWeight, maxVolume)

    function positionTests(positionID) {
        beforeEach(async () => {
            await PersistentManager.deleteAll("Position");

        })
        afterEach( async () => {
            await utility.deleteDatabase();
        })

        test('define position', async () => {
            await PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume);
            const pos = await PersistentManager.loadOneByAttribute('id', "Position", positionID);
            const expected = {
                id: "123412341234",
                aisle : "1234",
                row : "1234",
                col : "1234",
                max_weight : 1000,
                max_volume : 1000,
                occupied_weight: 0,
                occupied_volume: 0
            }
            expect(pos).toEqual(expected);
        })

        test('load positions', async()=> {
            await PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume);
            const p = await PositionManager.listAllPositions();
            
            const expected = {
                positionID: "123412341234",
                aisleID : "1234",
                row : "1234",
                col : "1234",
                maxWeight : 1000,
                maxVolume : 1000,
                occupiedWeight: 0,
                occupiedVolume: 0
            }
            expect(p[0]).toEqual(expected);
            expect(p[1]).toEqual(undefined);
        })

        test('modify position id', async() => {
            await PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume);
            const newID = "000100010001"
            await PositionManager.changePositionID(positionID, newID);
            const pos = await PositionManager.listAllPositions();
            const p = pos[0]
            const expected = {
                positionID: "000100010001",
                aisleID : "0001",
                row : "0001",
                col : "0001",
                maxWeight : 1000,
                maxVolume : 1000,
                occupiedWeight: 0,
                occupiedVolume: 0
            }
            expect(p).toEqual(expected);

        })
        test('modify position id 404', async() => {
            await PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume);
            const newID = "000100010001"
            return expect(PositionManager.changePositionID("notExisting", newID)).rejects.toEqual("404 position");
        })

        test('modify position', async () => {
            await PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume);
            await PositionManager.modifyPosition(positionID,"0123","0123","0123",1,1,1,1);
            const p = await PersistentManager.loadOneByAttribute("id", "Position", "012301230123");
            expect(p.id).toEqual("012301230123")
        })

        test('modify position', async () => {
            await PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume);
            return expect(PositionManager.modifyPosition("notEx","0123","0123","0123",1,1,1,1)).rejects.toEqual("404 position");
            
        })





        test('delete position', async () => {
            await PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume);
            await PositionManager.deletePosition(positionID);
            const positions = await PersistentManager.loadAllRows("Position");
            expect(positions).toEqual([]);
        })
    }
})