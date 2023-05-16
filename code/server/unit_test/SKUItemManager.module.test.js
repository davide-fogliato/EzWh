const PersistentManager = require('../bin/DB/PersistentManager');
const SKUItemManager = require('../bin/controller/SKUItemManager');
const utility = require('../bin/utility/utility');

describe('sku items tests', () => {


    const rfid = "12341234123412341234123412341234";
    const date = "2022-01-01";

    let expected = null;
    

    skuItemsTests(rfid, date);

    function skuItemsTests (rfid, dateofstock) {
        let s1 = null;
        beforeEach(async () => {
            await utility.deleteDatabase();
  
            
        })

        test('test define sku item', async () => {
            s1 = {
                description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            let id1 = await PersistentManager.store("SKU", s1);
            expected = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: id1,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }
            await SKUItemManager.defineSKUItem(rfid, id1, dateofstock);
            const skuitem = await PersistentManager.loadOneByAttribute('rfid', "SKUItem", rfid);
            expect(skuitem).toEqual(expected);
        })

        //SEARCH BY RFID
        test('get item by rfid', async() => {
            s1 = {
                description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            let id1 = await PersistentManager.store("SKU", s1);
            expected = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: id1,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }
            expectedForAPI = {
                RFID: '12341234123412341234123412341234',
                Available: 0,
                DateOfStock: '2022-01-01',
                SKUId: id1
            }
            await SKUItemManager.defineSKUItem(rfid, id1, dateofstock);
            const item = await SKUItemManager.searchByRFID(rfid);
            expectedFromApi = {...expected};
            
            expect(item).toEqual(expectedForAPI);
        })

        test('delete sku item', async() => {
            s1 = {
                description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            let id1 = await PersistentManager.store("SKU", s1);
            await SKUItemManager.defineSKUItem(rfid, id1, dateofstock);
            await SKUItemManager.deleteSKUItem(rfid);
            const items = await PersistentManager.loadAllRows("SKUItem");
            expect(items).toEqual([]);
        })

        test('modify sku item', async ()=> {
            s1 = {
                description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            let id1 = await PersistentManager.store("SKU", s1);
            await SKUItemManager.defineSKUItem(rfid, id1, dateofstock);
            await SKUItemManager.modifySKUItem(rfid, "43452299435113961900084151487623", 1, "2022-02-02");
            let item = await SKUItemManager.searchByRFID("43452299435113961900084151487623");
            const expectedForAPI = {
                RFID: '43452299435113961900084151487623',
                Available: 1,
                DateOfStock: '2022-02-02',
                SKUId: id1
            }
            expect(item).toEqual(expectedForAPI);
        })

        test('list for sku', async () => {
            s1 = {
                description: "description",
                weight: 10,
                volume: 10,
                price: 10, 
                notes: "notes",
                availableQuantity: 10,
                position: null
            }
            let id1 = await PersistentManager.store("SKU", s1);
            await SKUItemManager.defineSKUItem(rfid, id1, dateofstock);
            await SKUItemManager.modifySKUItem(rfid, rfid, 1, dateofstock);
            let l = await SKUItemManager.listForSKU(id1);
            expected = [{
                Available: 1,
                RFID: rfid,
                DateOfStock: dateofstock,
                SKUId: id1,
                internalOrder_id: null,
                restockOrder_id: null,
                returnOrder_id: null
            }]
            expect(l).toEqual(expected);
        })

    }
});

