'use strict'

class InternalOrderProduct {
    static tableName = 'InternalOrderProduct';
    constructor (id, description, price, quantity, sku_id, internalOrder_id) {
        this.id = id;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.sku_id = sku_id;
        this.internalOrder_id = internalOrder_id;
    }
}

module.exports = InternalOrderProduct;