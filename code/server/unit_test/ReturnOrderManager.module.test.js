const PersistentManager = require("../bin/DB/PersistentManager");
const RestockOrderManager = require("../bin/controller/RestockOrderManager");
const TransportNote = require("../bin/model/TransportNote");
const RestockOrder = require("../bin/model/RestockOrder");
const ReturnOrderManager = require("../bin/controller/ReturnOrderManager");
const SKU = require("../bin/model/SKU");
const SKUItem = require("../bin/model/SKUItem");
const utility = require("../bin/utility/utility");
const UserManager = require("../bin/controller/UserManager");
const SKUItemManager = require("../bin/controller/SKUItemManager");
const ItemManager = require("../bin/controller/ItemManager");

describe("Return tests", () => {
  ReturnOrderTest();

  function ReturnOrderTest() {
    beforeEach(async () => {
      await utility.deleteDatabase();

      /*
            let s = new SKUItem( input.productsList[0].RFID, SkuId,"2021/10/29 09:33",null,null,null);
            utility.renameKey(s, "relativeSKU", "SKUId");
            utility.renameKey(s, "internalOrder", "internalOrder_id");
            utility.renameKey(s, "restockOrder", "restockOrder_id");
            utility.renameKey(s, "returnOrder", "returnOrder_id");
    
            await PersistentManager.store("SKUItem",s);*/
    });

    afterEach(async () => {
      await utility.deleteDatabase();
    });

    test("define returnOrder", async () => {
      let Sku = new SKU(null, "product", "2", "3", 10.99, "notes", 5, null);
      delete Sku.testDescriptors;
      let supp = await UserManager.defineUser(
        "john",
        "smith",
        "password",
        "john@smit.com",
        "supplier"
      );
      let SkuId = await PersistentManager.store("SKU", Sku);
      let input = {
        date: "2021/11/29 09:33",
        productsList: [
          {
            SKUId: SkuId,
            description: "a new item",
            price: 10.99,
            RFID: "12345678901234567890123456789019",
          },
        ],
      };
      //skuitem must exist
      await SKUItemManager.defineSKUItem(
        input.productsList[0].RFID,
        SkuId,
        "2021/10/29 09:33"
      );
      await ItemManager.defineItem(1, "des", 10.99, SkuId, supp);
      //   prods = [
      //     {
      //       SKUId: SkuId,
      //       description: "a new item",
      //       price: 10.99,
      //       qty: 30,
      //     },
      //   ];
      let input1 = {
        issue_date: "2021/11/29 09:33",
        products: [
          {
            SKUId: SkuId,
            itemId: 1,
            description: "product",
            price: 10.99,
            qty: 30,
          },
        ],
        supplier_id: supp,
      };
      let restockOrderId = await RestockOrderManager.defineRestockOrder(
        input1.issue_date,
        input1.products,
        input1.supplier_id
      );

      let roId = await ReturnOrderManager.defineReturnOrder(
        input.date,
        input.productsList,
        restockOrderId
      );

      const ro = await PersistentManager.loadOneByAttribute(
        "id",
        "ReturnOrder",
        roId
      );

      const expected = {
        id: roId,
        returnDate: input.date,
        restockOrder_id: restockOrderId,
      };
      expect(ro).toEqual(expected);
    });

    test("define invalid return ", async () => {
      return expect(
        ReturnOrderManager.defineReturnOrder("2022-20-20", [], 0)
      ).rejects.toEqual("404 not found restockOrderId");
    });

    test("load All returnOrder", async () => {
      let Sku = new SKU(null, "a new item", "2", "3", 10.99, "notes", 5, null);
      delete Sku.testDescriptors;
      let supp = await UserManager.defineUser(
        "john",
        "smith",
        "password",
        "john@smit.com",
        "supplier"
      );
      let SkuId = await PersistentManager.store("SKU", Sku);
      let date = "2021/11/29 09:33";
      let prods = [
        {
          SKUId: SkuId,
          itemId: 1,
          description: "a new item",
          price: 10.99,
          RFID: "12345678901234567890123456789019",
        },
      ];
      //skuitem must exist
      await SKUItemManager.defineSKUItem(
        prods[0].RFID,
        SkuId,
        "2021/10/29 09:33"
      );
      await ItemManager.defineItem(1, "a new item", 10.99, SkuId, supp);
      // let p = [
      //   {
      //     SKUId: SkuId,
      //     description: "a new item",
      //     price: 10.99,
      //     qty: 30,
      //   },
      // ];
      let input1 = {
        issue_date: "2021/11/29 09:33",
        products: [
          {
            SKUId: SkuId,
            itemId: 1,
            description: "product",
            price: 10.99,
            qty: 30,
          },
        ],
        supplier_id: supp,
      };
      let restockOrderId = await RestockOrderManager.defineRestockOrder(
        input1.issue_date,
        input1.products,
        input1.supplier_id
      );
      let roId = await ReturnOrderManager.defineReturnOrder(
        date,
        prods,
        restockOrderId
      );
      //const ro = await PersistentManager.loadOneByAttribute("id","ReturnOrder",roId);
      const res = await ReturnOrderManager.listAllReturnOrders();

      const expected = {
        id: roId,
        returnDate: date,
        products: prods,
        restockOrderId: restockOrderId,
      };
      expect(res[0]).toEqual(expected);
      //expect(res[1]).toEqual(undefined);
    });
  }
});
