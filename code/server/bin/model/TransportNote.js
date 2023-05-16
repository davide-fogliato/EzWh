'use strict'

class TransportNote {
    static tableName = 'TransportNote'
    constructor (id, deliveryDate) {
        this.id = id;
        this.deliveryDate = deliveryDate;
    }
}

module.exports=TransportNote;