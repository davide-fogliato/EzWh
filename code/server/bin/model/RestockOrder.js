'use strict'

class RestockOrder {
    static tableName = 'RestockOrder';
    constructor (id, issue_date, state, supplier_id, transportNoteid) {
        this.id = id;
        this.issue_date = issue_date;
        this.state = state;
        this.supplier_id = supplier_id;
        this.transport_note_id = transportNoteid;
    }

        //Checks if position ID is in a valid format
   
}

module.exports = RestockOrder;