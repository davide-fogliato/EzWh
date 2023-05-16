'use strict'

const UserManager = require("../controller/UserManager");
const PersistentManager = require("../DB/PersistentManager");


exports.renameKey = function (o, old_key, new_key) {
    if (old_key !== new_key) {
        Object.defineProperty(o, new_key,
            Object.getOwnPropertyDescriptor(o, old_key));
        delete o[old_key];
    }
}

/*
Password is always: testpassword
Customer: user1@ezwh.com
Quality Employee: qualityEmployee1@ezwh.com
Clerk: clerk1@ezwh.com
Delivery Employee: deliveryEmployee1@ezwh.com
Supplier: supplier1@ezwh.com
Manager: manager1@ezwh.com
*/

exports.deleteDatabase = async function() {
    await PersistentManager.deleteAll('InternalOrder');
    await PersistentManager.deleteAll('InternalOrderProduct');
    await PersistentManager.deleteAll('Item');
    await PersistentManager.deleteAll('Position');
    await PersistentManager.deleteAll('ProductOrder');
    await PersistentManager.deleteAll('RestockOrder');
    await PersistentManager.deleteAll('ReturnOrder');
    await PersistentManager.deleteAll('SKU');
    await PersistentManager.deleteAll('SKUItem');
    await PersistentManager.deleteAll('TestDescriptor');
    await PersistentManager.deleteAll('TestResult');
    await PersistentManager.deleteAll('TransportNote');
    await PersistentManager.deleteAll('User');
}
