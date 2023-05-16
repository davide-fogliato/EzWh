const PersistentManager = require('../bin/DB/PersistentManager');


function testExistsTrue(tableName, parameter_name, value) {
    describe('store user', () => {

        beforeEach(async () =>{
            item ={
                description : "description", 
                price : 10,
                SKUId : null,
                supplierId : null
            }
            await PersistentManager.deleteAll(tableName);
            await PersistentManager.store(tableName,item);
        })
        test('test exists valid', async () => {
            const result = await PersistentManager.exists(tableName, parameter_name,value);
            expect(result).toEqual(true);
        })
    
        afterEach(async () =>{
            await PersistentManager.deleteAll(tableName);
        })
    })
    
}

function testExistsFalse(tableName, parameter_name, value) {
    describe('store user', () => {

        beforeEach(async () =>  {
            item ={
                description : "description", 
                price : 10,
                SKUId : null,
                supplierId : null
            }
            await PersistentManager.deleteAll(tableName);
            await PersistentManager.store(tableName,item);
        })
        test('test exists valid', async () => {
            const result = await PersistentManager.exists(tableName, parameter_name,value);
            expect(result).toEqual(false);
        })
    
        afterEach(async () =>  {
            await PersistentManager.deleteAll(tableName);
        })
    })
    
}
function testExistsInvalid(tableName, parameter_name,value) {
    test('test exists invalid', async () => {
        return expect(PersistentManager.exists(tableName, parameter_name,value)).rejects.toThrow();

    })
}


testExistsTrue("Item", "description", "description");
testExistsFalse("Item", "description","not existing description");
testExistsInvalid("Invalid Name","description", "description");