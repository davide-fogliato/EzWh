const PersistentManager = require('../bin/DB/PersistentManager');
const InternalOrderManager = require('../bin/controller/InternalOrderManager');

const Item = require("../bin/model/Item");
const SKU = require("../bin/model/SKU")
const User = require("../bin/model/User")

describe('InternalOrder tests', () => {



   InternalOrderTest()

    function InternalOrderTest() {
       
        let input={};
        beforeEach(async () => {
            await PersistentManager.deleteAll("InternalOrder");
            await PersistentManager.deleteAll("SKU");
            await PersistentManager.deleteAll("InternalOrderProduct");
            

        })

        test('define InternalOrder', async () => {
            //customer must  exist  
            const user = new User("user1@ezwh.com", "testpassword", "John", "Snow", "customer");          
            customerId = await PersistentManager.store("User",user);
            
            //sku must exist
            let Sku  = new SKU(null, "product", "2", "3", 10.99, "notes", 5, null);
            delete Sku.testDescriptors;
            let SkuId = await PersistentManager.store("SKU",Sku);
            // //itemid must be exist
            // let item = new Item(null,"a new item",10.99,SkuId,supplier_id);
            // let itemId = await PersistentManager.store("Item",item);
        
            input ={
                date : "2021/11/29 09:33",
                products : [{"SKUId":SkuId,"description":"a new item","price":10.99,"qty":30},
                           ],
            
                customerId : customerId
            }

            let IoId =  await InternalOrderManager.defineInternalOrder(input.date, input.products, input.customerId);          
            const res = await PersistentManager.loadOneByAttribute("id","InternalOrder",IoId);
            const expected = {
                id: IoId,
                date: input.date,
                state:"ISSUED",
                customer_id : input.customerId
                
            };
            expect(res).toEqual(expected);
        })

        test('modify state completed products list',async () => {
            //customer must  exist  
            const user = new User("user1@ezwh.com", "testpassword", "John", "Snow", "customer");          
            customerId = await PersistentManager.store("User",user);
            //sku must exist
            let Sku  = new SKU(null, "product", "2", "3", 10.99, "notes", 5, null);
            delete Sku.testDescriptors;
            let SkuId = await PersistentManager.store("SKU",Sku);
            // //itemid must be exist
            // let item = new Item(null,"a new item",10.99,SkuId,supplier_id);
            // let itemId = await PersistentManager.store("Item",item);
            input ={
                date : "2021/11/29 09:33",
                products : [{"SKUId":SkuId,"description":"a new item","price":10.99,"qty":30}],
                customerId : customerId
            }

            let IoId =  await InternalOrderManager.defineInternalOrder(input.date, [], input.customerId);      
            await InternalOrderManager.modifyState(IoId, "COMPLETED", [{"SkuID":SkuId,"RFID":"12345678901234567890123456789016"}]);
            let i = await InternalOrderManager.listIOByID(IoId);
            expect(i.state).toEqual("COMPLETED");

        })
        test('load All InternalOrder', async()=> {
            //customer must  exist  
            const user = new User("user1@ezwh.com", "testpassword", "John", "Snow", "customer");          
            customerId = await PersistentManager.store("User",user);
            
            //sku must exist
            let Sku  = new SKU(null, "product", "2", "3", 10.99, "notes", 5, null);
            delete Sku.testDescriptors;
            let SkuId = await PersistentManager.store("SKU",Sku);
            // //itemid must be exist
            // let item = new Item(null,"a new item",10.99,SkuId,supplier_id);
            // let itemId = await PersistentManager.store("Item",item);
        
            input ={
                date : "2021/11/29 09:33",
                products : [{"SKUId":SkuId,"description":"a new item","price":10.99,"qty":30},
                           ],
            
                customerId : customerId
            }
            let IoId =  await InternalOrderManager.defineInternalOrder(input.date, input.products, input.customerId);          
            const res = await InternalOrderManager.listAllInternalOrder();
            
            const expected = {
                id: IoId,
                issueDate: input.date,
                state:"ISSUED",
                customerId : input.customerId,
                products:input.products
                
            };
            expect(res[0]).toEqual(expected);
            expect(res[1]).toEqual(undefined);
        })


        test('modify state ', async() => {
            //customer must  exist  
            const user = new User("user1@ezwh.com", "testpassword", "John", "Snow", "customer");          
            customerId = await PersistentManager.store("User",user);
            
            //sku must exist
            let Sku  = new SKU(null, "product", "2", "3", 10.99, "notes", 5, null);
            delete Sku.testDescriptors;
            let SkuId = await PersistentManager.store("SKU",Sku);
            // //itemid must be exist
            // let item = new Item(null,"a new item",10.99,SkuId,supplier_id);
            // let itemId = await PersistentManager.store("Item",item);
        
            input ={
                date : "2021/11/29 09:33",
                products : [{"SKUId":SkuId,"description":"a new item","price":10.99,"qty":30},
                           ],
            
                customerId : customerId
            }
            const newState = "COMPLETED";
            //products will e empty conce completed
            // return type change if state change into delivered
            let roId =  await InternalOrderManager.defineInternalOrder(input.date, input.products, input.customerId);             
            await InternalOrderManager.modifyState(roId,newState);
            const res = await InternalOrderManager.listAllInternalOrder();
            const expected = {
                id: roId,
                issueDate: input.date,
                state:"COMPLETED",
                products:[],
                customerId : input.customerId
                
            };
            expect(res[0]).toEqual(expected);

            


        })
    }
})
