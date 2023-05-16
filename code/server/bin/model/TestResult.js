'use strict'

class TestResult {
    static tableName = 'TestResult';
    constructor (id, rfid,  Date, Result, idTestDescriptor) {
        this.id = id;
        this.rfid = rfid;
        this.idTestDescriptor = idTestDescriptor;
        this.Date = Date;
        this.Result = Result;
    }
}

module.exports = TestResult;