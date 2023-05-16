"use strict";

const SKUItem = require("../model/SKUItem");
const PersistentManager = require("../DB/PersistentManager");
const utility = require("../utility/utility");
const SKU = require("../model/SKU");

class SKUItemManager {
	constructor() {}

	async defineSKUItem(rfid, skuId, dateOfStock) {
        let exists = await PersistentManager.exists(SKU.tableName, 'id', skuId);
        if (!exists) {
            return Promise.reject("404 SKU");
        }
        let existsRfid = await PersistentManager.exists(SKUItem.tableName, 'rfid', rfid);
        if (existsRfid) {
            return Promise.reject("422 duplicate");
        }
		//constructor (rfid, available, date_of_stock, relativeSKU, internalOrder, restockOrder, returnOrder, testResult)
		const s = new SKUItem(
			rfid,
			0,
			dateOfStock,
			skuId,
			null,
			null,
			null
		);
		//Rename the keys to store in the database properly.

		utility.renameKey(s, "relativeSKU", "SKUId");
		utility.renameKey(s, "internalOrder", "internalOrder_id");
		utility.renameKey(s, "restockOrder", "restockOrder_id");
		utility.renameKey(s, "returnOrder", "returnOrder_id");

		//validation todo
		return PersistentManager.store(SKUItem.tableName, s);
	}

	async listAllSKUItems() {
		return PersistentManager.loadAllRows(SKUItem.tableName);
	}

	async listForSKU(SKUId) {
		const exists = await PersistentManager.exists(SKU.tableName, 'id', SKUId);
		if (!exists) {
			return Promise.reject("404 sku");
		}
		return PersistentManager.loadByMoreAttributes(
			SKUItem.tableName,
			["SKUId", "available"],
			[SKUId, 1]
		);
	}

	async searchByRFID(rfid) {

		const exists = await PersistentManager.exists(SKUItem.tableName, 'rfid', rfid);
		if (!exists) {
			return Promise.reject("404 rfid");
		}

		return PersistentManager.loadOneByAttributeSelected(
			SKUItem.tableName,
			"RFID",
			rfid,
			["RFID", "SKUId", "Available", "DateOfStock"]
		);
	}

	async modifySKUItem(oldRFID, newRFID, newAvailable, newDateOfStock) {
        const exists = await PersistentManager.exists(SKUItem.tableName, 'rfid', oldRFID);
        if (!exists) {
            return Promise.reject("404 rfid");
        }
		const newSKUItem = new SKUItem(
			newRFID,
			newAvailable,
			newDateOfStock,
			null,
			null,
			null,
			null,
			null
		);
		//validation to do
		const skuItemToStore = {
			RFID: newSKUItem.RFID,
			Available: newAvailable,
			dateOfStock: newDateOfStock,
		};
		return PersistentManager.update(
			SKUItem.tableName,
			skuItemToStore,
			"rfid",
			oldRFID
		);
	}

	async deleteSKUItem(RFID) {
		return PersistentManager.delete("rfid", RFID, SKUItem.tableName);
	}
}

module.exports = new SKUItemManager();
