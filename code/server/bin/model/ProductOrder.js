'use strict'

class ProductOrder {
    static tableName = 'ProductOrder';
    constructor (id, quantity, restockOrder_id, item_id) {
        this.id = id;
        this.quantity = quantity;
        this.restockOrder_id = restockOrder_id ;
        this.item_id = item_id;
    }
}

module.exports = ProductOrder;