
const SKUManager = require('../bin/controller/SKUManager');
const PersistentManager = require('../bin/DB/PersistentManager');
const utility = require('../bin/utility/utility');

//Assuming data validation done at a higher level
function testDefineSKU() {
describe('define sku', () => {

    beforeEach( async () => {
        await utility.deleteDatabase();
    })
    test('define sku', async () => {
        const lastSKUId = await SKUManager.defineSKU("description", 10, 10, 10, "notes", 10);
        const sku = await PersistentManager.loadOneByAttribute('id', "SKU", lastSKUId);
        const expected = {
            id: lastSKUId,
            description: "description",
            weight: 10,
            volume: 10,
            price: 10, 
            notes: "notes",
            availableQuantity: 10,
            position: null
        }
        expect(sku).toEqual(expected);
    })

    test('define sku invalid', async () => {
        const lastSKUId = await SKUManager.defineSKU("description", 10, 10, 10, "notes", 10);
        const sku = await PersistentManager.loadOneByAttribute('id', "SKU", lastSKUId);
        const expected = {
            id: lastSKUId,
            description: "description different",
            weight: 10,
            volume: 10,
            price: 10, 
            notes: "notes",
            availableQuantity: 10,
            position: null
        }
        expect(sku).not.toEqual(expected);
    })


})
}

//Define sku valid
testDefineSKU()


describe('list all skus', () => {
    const tableName = "SKU";
    const s1 = {
        description: "description",
        weight: 10,
        volume: 10,
        price: 10, 
        notes: "notes",
        availableQuantity: 10,
        position: null
    }

    let id1 = null;
    
    beforeEach(async () => {
        await utility.deleteDatabase();
        //id1 = await PersistentManager.store(tableName, s1);
    })

    test('test list all skus valid', async () => {
        id1 = await SKUManager.defineSKU(s1.description, s1.weight, s1.volume, s1.price, s1.notes, s1.availableQuantity);
        const list = await SKUManager.listAllSKUs();
        let exp1 = s1;
        exp1.id = id1;
        exp1.testDescriptors = [];
        const sku = list[0];
        expect(sku).toEqual(exp1);
    })
    
});

describe('set sku position', () => {
    
    let p1= {
        id: "123412341234",
        aisle: "1234",
        row: "1234",
        col: "1234",
        max_weight: 100,
        max_volume: 100,
        occupied_weight: 0,
        occupied_volume: 0
    }
    const sk = {
        description: "description",
        weight: 10,
        volume: 10,
        price: 10, 
        notes: "notes",
        availableQuantity: 10,
        position: null
    }
    
    let idSKU = null;
    let positionID = p1.id;
    
    setPosition(idSKU, positionID);

    function setPosition (kuid, positionid) {
        beforeEach(async () => {
            
            await utility.deleteDatabase();
            
            
        })

        test('change sku position valid', async () => {

            idSKU = await PersistentManager.store("SKU", sk);
            await PersistentManager.store("Position", p1);
            await SKUManager.setPosition(idSKU, positionID);
            const s = await PersistentManager.loadOneByAttribute('id', "SKU", idSKU);
            const p = await PersistentManager.loadOneByAttribute('id', "Position", positionID);
            
            expect(s.position + "").toEqual(positionID);
            expect(p.occupied_volume).toEqual(s.volume*s.availableQuantity);
            expect(p.occupied_weight).toEqual(s.weight*s.availableQuantity);
        })

        test('change sku position invalid', async () => {

            idSKU = await PersistentManager.store("SKU", sk);
            await PersistentManager.store("Position", p1);
            return expect(SKUManager.setPosition(idSKU, "not existing")).rejects.toEqual("404 position");
            /*
            await SKUManager.setPosition(idSKU, positionID);
            const s = await PersistentManager.loadOneByAttribute('id', "SKU", idSKU);
            const p = await PersistentManager.loadOneByAttribute('id', "Position", positionID);
            
            expect(s.position + "").not.toEqual(positionID);*/
        })

        test('change sku position sku invalid', async () => {

            idSKU = await PersistentManager.store("SKU", sk);
            await PersistentManager.store("Position", p1);
            return expect(SKUManager.setPosition(idSKU + 1, positionID)).rejects.toEqual("404 SKU");
            /*
            await SKUManager.setPosition(idSKU, positionID);
            const s = await PersistentManager.loadOneByAttribute('id', "SKU", idSKU);
            const p = await PersistentManager.loadOneByAttribute('id', "Position", positionID);
            
            expect(s.position + "").not.toEqual(positionID);*/
        })
    }
});

describe('modifySku', ()=> {
    const skuToSave = {
        description: "des",
        weight: 1,
        volume: 1,
        price: 1,
        notes: "notes",
        availableQuantity: 1,
        position: null
    }
    const position = {
        id: "123412341234",
        aisle: "1234",
        row: "1234",
        col: "1234",
        max_weight: 100,
        max_volume: 100,
        occupied_weight: 0,
        occupied_volume: 0
    }
    beforeEach(async () => {
        await utility.deleteDatabase();
        await PersistentManager.store("Position", position);

    })

    modifySKU("newDes", 1,1,1,"notes",2);

    function modifySKU(newDes, newWeight, newVolume, newPrice, newNotes, newQuantity) {
        test('modify sku', async () => {
            skuToSave.position = position.id;
        let skuid = await PersistentManager.store("SKU", skuToSave);
        await SKUManager.modifySKU(skuid, newDes, newWeight, newVolume, newPrice, newNotes, newQuantity);
        const expected = {
            description: "newDes",
            weight: 1,
            volume: 1,
            price: 1,
            notes: "notes",
            availableQuantity: 2,
            position: "123412341234",
            testDescriptors: []
        }
        const sku_to_expect = await SKUManager.getSKUByID(skuid);
        expect(sku_to_expect).toEqual(expected);
        })
    }
})


