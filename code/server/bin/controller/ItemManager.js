const Item = require('../model/Item');
const User = require('../model/User');
const PersistentManager = require('../DB/PersistentManager');
const SKU = require("../model/SKU");
const { Test } = require('mocha');


class ItemManager {

    constructor() {}

    async defineItem(id, description, price, SKUId,supplierId) {
        
        let i = new Item(id,description, price, SKUId,supplierId); 
        
        let loadedSKU = await PersistentManager.loadOneByAttribute("id",SKU.tableName, SKUId);
        if (!loadedSKU) {
            return Promise.reject("404 SKU not found");
        }
        let loadedUser = await PersistentManager.loadOneByAttribute("id",User.tableName,supplierId);
        if (!loadedUser || loadedUser.type.toLowerCase() != 'supplier') {
            return Promise.reject("404 Supplier not found");
        }
        let loadedItem = await PersistentManager.loadOneByAttribute("id",Item.tableName, id);
        if(loadedItem){
            if(loadedItem.supplierId == supplierId){
                return Promise.reject("422 supplier already sells an Item with the same ID");
            }
        }
        let listSameSKUId = await PersistentManager.loadFilterByAttribute(Item.tableName,"SKUId",SKUId);
        if(listSameSKUId){
            for (let i = 0; i < listSameSKUId.length; i++) {
                if(listSameSKUId[i].supplierId == supplierId){
                 return Promise.reject("422 this supplier already sells an item with the same SKUId"); 
                }
              }
        }
        return PersistentManager.store(Item.tableName, i); 
    }

   async getAllItems() {
        let items = PersistentManager.loadAllRows(Item.tableName);
        return items;
    }

    async getItemByID(ItemId, supplierId) {
        let i = await PersistentManager.loadByMoreAttributes(Item.tableName, ['id', 'supplierId'], [ItemId, supplierId]);
        
        return i[0];
    }

    async modifyItem(ItemId, supplierId, newDescription, newPrice) {
        let exists = true;
        const items = await PersistentManager.loadByMoreAttributes(Item.tableName, ['id', 'supplierId'], [ItemId, supplierId]);
        if (items.length != 1) {
            exists = false;
        }
        if (exists) {
            let itemToUpdate = {
                description: newDescription,
                price: newPrice,
            }
            return PersistentManager.updateByTwoAttributes(Item.tableName, itemToUpdate, ['id', 'supplierId'], [ItemId, supplierId]);
        }
        else {
            return Promise.reject("404")
        }
    }

    
    async deleteItem(ItemId, supplierId) {
        return PersistentManager.deleteByTwoAttrs(['id','supplierId'], [ItemId, supplierId], Item.tableName);
        
    }

}


module.exports = new ItemManager();