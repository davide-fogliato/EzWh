"use strict";
//import returnOrderObject
const ReturnOrder = require("../model/ReturnOrder");
const PersistentManager = require("../DB/PersistentManager");
const ProductOrder = require("../model/ProductOrder");
const SkuItem = require("../model/SKUItem");
const Sku = require("../model/SKU");
const RestockOrder = require("../model/RestockOrder");
const Item = require("../model/Item");
// const dao = require("../bin/model/mock_persistanceManager")

class ReturnOrderManager {
  constructor() {}

  async defineReturnOrder(date, productsList, roId) {
    const exists = await PersistentManager.exists(
      RestockOrder.tableName,
      "id",
      roId
    );
    if (!exists) {
      return Promise.reject("404 not found restockOrderId");
    }

    let newReO = new ReturnOrder(null, date, roId);
    let newReturnOID = await PersistentManager.store(
      ReturnOrder.tableName,
      newReO
    );
    //iterate in productlist of one order and insert this orderid in skuitem table as well

    for (const product of productsList) {
      let curproRFID = product.RFID;
      PersistentManager.update(
        SkuItem.tableName,
        { returnOrder_id: newReturnOID },
        "RFID",
        curproRFID
      );
      PersistentManager.update(
        SkuItem.tableName,
        { Available: 0 },
        "RFID",
        curproRFID
      );
    }
    return newReturnOID;
  }

  async listAllReturnOrders() {
    let ReturnOrders = await PersistentManager.loadAllRows(
      ReturnOrder.tableName
    );
    //get rdif and skuid from SKUitem table
    let res = [];
    //let productList = [];
    for (const curReturnOrder of ReturnOrders) {
      //return every product info

      let product = await this.addProductsList(curReturnOrder);
      //combine into a array
      //productList.push(product);

      let result = {
        id: curReturnOrder.id,
        returnDate: curReturnOrder.returnDate,
        products: product,
        restockOrderId: curReturnOrder.restockOrder_id,
      };
      res.push(result);
    }

    return res;
  }

  async getReturnOrderByID(reoID) {
    const exists = await PersistentManager.exists(
      ReturnOrder.tableName,
      "id",
      reoID
    );
    if (!exists) {
      return Promise.reject("404 ReturnOrderid cannot found");
    }
    let curReturnOrder = await PersistentManager.loadOneByAttribute(
      "id",
      ReturnOrder.tableName,
      reoID
    );
    //select rfid and skuid fromo skuitem table where resturnOrder id =reoid

    let product = await this.addProductsList(curReturnOrder);
    let result = {
      returnDate: curReturnOrder.returnDate,
      products: product,
      restockOrderId: curReturnOrder.restockOrder_id,
    };

    return result;
  }

  async addProductsList(curReturnOrder) {
    //select skuid from skuitem where resturnorderid=val
    //select description && price && rfid from SKU where skuid ...
    let curReturnOrderid = curReturnOrder.id;

    let skuItemList = await PersistentManager.loadFilterByAttribute(
      SkuItem.tableName,
      "returnOrder_id",
      curReturnOrderid
    );

    let productList = [];
    for (const sku of skuItemList) {
      //   let result = await PersistentManager.loadFilterByAttribute(
      //     Sku.tableName,
      //     "id",
      //     sku.SKUId
      //   );
      // let productOrder = await PersistentManager.loadFilterByAttribute(ProductOrder.tableName, "restockOrder_id", sku.restockOrder_id);
      let item = await PersistentManager.loadOneByAttribute(
        "SKUId",
        Item.tableName,
        sku.SKUId
      );

      let i = {
        SKUId: sku.SKUId,
        itemId: item.id,
        description: item.description,
        price: item.price,
        RFID: sku.RFID,
      };
      productList.push(i);
    }
    return productList;
  }

  async deleteReturnOrder(reoID) {
    // let loadedReturnOrder = await this.getReturnOrderByID(reoID);
    // if (!loadedReturnOrder) {
    //     return Promise.reject("404 returnOrder not found")
    // }
    return PersistentManager.delete("id", reoID, ReturnOrder.tableName);
  }
}

module.exports = new ReturnOrderManager();
