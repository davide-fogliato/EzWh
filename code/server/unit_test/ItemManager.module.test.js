
const ItemManager = require('../bin/controller/ItemManager');
const PersistentManager = require('../bin/DB/PersistentManager');
const utility = require('../bin/utility/utility');

describe('define item', () => {
    const description = "description";
    const price = 10.10;
    beforeEach(async () => {
        //clear DB 
        await utility.deleteDatabase();
    });

    test('define item valid', async () => {
    const sku = {description: "description",
        weight: 10,
        volume: 10,
        price: 10, 
        notes: "notes",
        availableQuantity: 10,
        position: null
    }
    const user = {
        username: "test@test.com",
        password: "testPassword",
        name: "name",
        surname: "surname",
        type: "SUPPLIER"
    }
    let id_sku = await PersistentManager.store("SKU",sku);
    let supplier_id = await PersistentManager.store("User",user);
    const item_id = 1;
    await ItemManager.defineItem(item_id, description, price, id_sku,supplier_id);
    
    const Item = await PersistentManager.loadOneByAttribute('id', "Item", item_id);
    const expected = {
        id: item_id,
        description: description,
        price: price,
        SKUId: id_sku,
        supplierId: supplier_id
    }
    expect(Item).toEqual(expected);
});



test('define item 404', async () => {
    return expect(ItemManager.defineItem(12, "des", 1, 0, 0)).rejects.toEqual("404 SKU not found");
})

test('define item 404 supp', async () => {
    const sku = {description: "description",
        weight: 10,
        volume: 10,
        price: 10, 
        notes: "notes",
        availableQuantity: 10,
        position: null
    }
    let id_sku = await PersistentManager.store("SKU",sku);
    expect(ItemManager.defineItem(12, "des", 1, id_sku, 0)).rejects.toEqual("404 Supplier not found");
})


})



describe('Test modify Item', () => { 
    const ItemId = 1;
    const newDescription = "12341234123412341234123412341234";
    const newPrice = 1;

    beforeEach(async () => {
        //clear DB 
        await PersistentManager.deleteAll("Item");
        await PersistentManager.deleteAll("SKU");
        await PersistentManager.deleteAll("User");
        await utility.deleteDatabase();
    });

    test('modify Item', async () => {
        const sku = {description: "description",
            weight: 10,
            volume: 10,
            price: 10, 
            notes: "notes",
            availableQuantity: 10,
            position: null
        }
        const user = {
            username: "test@test.com",
            password: "testPassword",
            name: "name",
            surname: "surname",
            type: "SUPPLIER"
        }
        let sku_id = await PersistentManager.store("SKU",sku);
        let supplier_id = await PersistentManager.store("User",user);
        const item = {
            id: 1,
            description: "description",
            price: '2022-01-01',
            SKUId: sku_id,
            supplierId: supplier_id
        }
        let item_id = await PersistentManager.store("Item",item);
        await ItemManager.modifyItem(item_id, supplier_id, newDescription, newPrice);
        const Item = await PersistentManager.loadByMoreAttributes("Item", ['id', 'supplierId'], [item_id, supplier_id]);
        let expected = [];
        expected[0] = {
            id: item_id,
            description: newDescription,
            price: newPrice,
            SKUId: sku_id,
            supplierId: supplier_id
        }
        expect(Item).toEqual(expected);
    })

    


})

describe('delete item',  () => {
    beforeEach( async () => {
        await utility.deleteDatabase();
    })

    test('delete item', async () => {
        const sku = {description: "description",
            weight: 10,
            volume: 10,
            price: 10, 
            notes: "notes",
            availableQuantity: 10,
            position: null
        }
        const user = {
            username: "test@test.com",
            password: "testPassword",
            name: "name",
            surname: "surname",
            type: "SUPPLIER"
        }
        let sku_id = await PersistentManager.store("SKU",sku);
        let supplier_id = await PersistentManager.store("User",user);
        const item = {
            id: 1,
            description: "description",
            price: '2022-01-01',
            SKUId: sku_id,
            supplierId: supplier_id
        }
        let item_id = await PersistentManager.store("Item",item);
        await ItemManager.deleteItem(item_id,supplier_id);
    })


})


describe('get item', () => {
    const description = "description";
    const price = 10.10;
    beforeEach(async () => {
        //clear DB 
        await utility.deleteDatabase();
    });

    test('get item valid', async () => {
    const sku = {description: "description",
        weight: 10,
        volume: 10,
        price: 10, 
        notes: "notes",
        availableQuantity: 10,
        position: null
    }
    const user = {
        username: "test@test.com",
        password: "testPassword",
        name: "name",
        surname: "surname",
        type: "SUPPLIER"
    }
    let id_sku = await PersistentManager.store("SKU",sku);
    let supplier_id = await PersistentManager.store("User",user);
    const item_id = 1;
    await ItemManager.defineItem(item_id, description, price, id_sku,supplier_id);
    let res = await ItemManager.getAllItems();
    const Item = await PersistentManager.loadByMoreAttributes("Item", ['id', 'supplierId'], [item_id, supplier_id]);
    expect(res[0]).toEqual(Item[0]);

    
    });

    test('get item with id', async () => {
        const sku = {description: "description",
            weight: 10,
            volume: 10,
            price: 10, 
            notes: "notes",
            availableQuantity: 10,
            position: null
        }
        const user = {
            username: "test@test.com",
            password: "testPassword",
            name: "name",
            surname: "surname",
            type: "SUPPLIER"
        }
        let id_sku = await PersistentManager.store("SKU",sku);
        let supplier_id = await PersistentManager.store("User",user);
        const item_id = 1;
        await ItemManager.defineItem(item_id, description, price, id_sku,supplier_id);
        let res = await ItemManager.getItemByID(item_id, supplier_id);
        const Item = await PersistentManager.loadByMoreAttributes("Item", ['id', 'supplierId'], [item_id, supplier_id]);
    
        expect(res).toEqual(Item[0]);
    
        
    });
    





})






