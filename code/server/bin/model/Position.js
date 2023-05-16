'use strict'

const res = require("express/lib/response");

class Position {
    static tableName = 'Position';
    
    constructor (id, aisle, row, col, max_weight, max_volume, occupied_weight, occupied_volume) {
        this.id = id;
        this.aisle = aisle;
        this.row = row;
        this.col = col;
        this.max_weight = max_weight; 
        this.max_volume = max_volume;
        this.occupied_weight = occupied_weight;
        this.occupied_volume = occupied_volume;
    }

    //Checks if position ID is in a valid format
    isIdValid() {
        if (this.id) {
            let idString = '' + this.id;
            if (idString.length !== 12) {
                return false;
            }
            //divides position in 3 parts (aisle, row and col)
            let coords = this.id.match(/.{1,4}/g);
            let aisle = coords[0];
            let row = coords[1];
            let col = coords[2];
            if (aisle != this.aisle || row != this.row || col != this.col) {
                return false;
            }
            return true;
        }
        else {
            return false;
        }
    }

    canItStore(tot_weight, tot_volume) {
        let res = true;
        if (tot_weight > this.max_weight || tot_volume > this.max_volume) {
            res = false;
        }
        return res;
    }
}

module.exports = Position;