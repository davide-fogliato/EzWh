'use strict'

class TestDescriptor {
    static tableName = 'TestDescriptor';
    constructor (id, name, procedureDescription, idSKU) {
        this.id = id;
        this.name = name;
        this.procedureDescription = procedureDescription;
        this.idSKU = idSKU;
    }
}

module.exports = TestDescriptor;