'use strict'

class SKU {

    static tableName = 'SKU';

    constructor (id, description, weight, volume, price, notes, quantity, position, testDescriptors = []) {
        this.id = id;
        this.description = description; 
        this.weight = weight; 
        this.volume = volume;
        this.price = price;
        this.notes = notes;
        this.availableQuantity = quantity;
        this.position = position;
        this.testDescriptors = testDescriptors;
    }
}

module.exports = SKU;