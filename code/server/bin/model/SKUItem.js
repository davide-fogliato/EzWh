'use strict'

class SKUItem {
    static tableName = 'SKUItem';
    constructor (rfid, available, dateOfStock, relativeSKU, internalOrder, restockOrder, returnOrder) {
        this.RFID = rfid;
        this.Available = available;
        this.dateOfStock = dateOfStock;
        this.relativeSKU = relativeSKU;
        this.internalOrder = internalOrder; 
        this.restockOrder = restockOrder;
        this.returnOrder = returnOrder;

    }
}

module.exports = SKUItem;