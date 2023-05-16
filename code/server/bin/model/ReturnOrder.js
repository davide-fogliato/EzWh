'use strict'

class ReturnOrder {
    static tableName = 'ReturnOrder';
    constructor (id,returnDate, restockOrder_id) {
        this.id = id;
        this.returnDate = returnDate;
        this.restockOrder_id = restockOrder_id;
    }
}

module.exports = ReturnOrder;