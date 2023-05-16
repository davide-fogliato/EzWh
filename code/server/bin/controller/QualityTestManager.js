const TestDescriptor = require('../model/TestDescriptor');
const TestResult = require('../model/TestResult');
const SKUItem = require('../model/SKUItem');
const PersistentManager = require('../DB/PersistentManager');
const SKU = require("../model/SKU");
const { Test } = require('mocha');


class QualityTestManager {

    constructor() {}

    ///TEST DESCRIPTOR///

    async defineTestDescriptor(name, procedureDescription, idSKU) {
        
        let t = new TestDescriptor(null,name, procedureDescription, idSKU); 
        //TestDescriptor id is autoincremented
        delete t.id;
        let exists = await PersistentManager.exists(SKU.tableName, 'id', idSKU);
        if (!exists) {
            return Promise.reject("404");
        }
        return PersistentManager.store(TestDescriptor.tableName, t); 
    }

   async getAllTestDescriptors() {
        let tests = PersistentManager.loadAllRows(TestDescriptor.tableName);
        return tests;
    }

    async getTestDescriptorByID(TestId) {
        return PersistentManager.loadOneByAttribute('id', TestDescriptor.tableName, TestId);
    }

    async modifyTestDescriptor(TestId, newName, newProcedureDescription, newIdSKU) {
        const exists = await PersistentManager.exists(TestDescriptor.tableName, 'id', TestId);
        if (exists) {
            let testToUpdate = {
                name: newName,
                procedureDescription: newProcedureDescription,
                idSKU: newIdSKU,
            }
            let sku_exists = await PersistentManager.exists(SKU.tableName, 'id', newIdSKU);
            if (!sku_exists) {
                return Promise.reject("404 idSKU not found");
            }

            return PersistentManager.update(TestDescriptor.tableName, testToUpdate, 'id', TestId);
        }
        else {
            return Promise.reject("404 TestDescriptor id not found")
        }
    }

    
    async deleteTestDescriptor(TestId) {
        const exists = await PersistentManager.exists(TestDescriptor.tableName, 'id', TestId);
        if (!exists){
            return Promise.reject("404");
        }
        return PersistentManager.delete('id', TestId, TestDescriptor.tableName);
        
     }


     ///TEST RESULT///

    async  defineTestResult(rfid,Date,Result,idTestDescriptor) {
        
        let t = new TestResult(null,rfid,Date,Result,idTestDescriptor); 
        //TestResult id is autoincremented
        delete t.id;

        const existsTestDescriptor = await PersistentManager.exists(TestDescriptor.tableName, 'id', idTestDescriptor);
        if (existsTestDescriptor) {
            const existsRfid = await PersistentManager.exists(SKUItem.tableName, 'rfid', rfid);
            if (existsRfid) {
                return PersistentManager.store(TestResult.tableName, t); 
            }
            else {
                return Promise.reject("404 rfid not found");
            }
        }
        else {
            return Promise.reject("404 TestDescriptor not found");
        }
    }

    async getAllTestResultsByRFID(rfid) {    
        const exists = await PersistentManager.exists(SKUItem.tableName, 'rfid', rfid);
        if (!exists) {
            return Promise.reject("404");
        }
        
        const testResults = await PersistentManager.loadAllRows(TestResult.tableName, 'rfid', rfid);
        
        const testsAPI = testResults.map(
            (t) => {
                return {
                    id: t.id,
                    idTestDescriptor: t.idTestDescriptor,
                    Date: t.Date,
                    Result: t.Result
                }
            }
        );
        return testsAPI;
    }

    async getTestResultByID(TestId,rfid) {
        return PersistentManager.loadByMoreAttributes(TestResult.tableName,["rfid","id"],[rfid,TestId]);
    }

    async modifyTestResultByID(TestId,rfid, newIdTestDescriptor, newDate, newResult) {
        const exists = await PersistentManager.exists(TestResult.tableName, 'id', TestId);
        if (exists) {
            let loadedTestResult = await PersistentManager.loadOneByAttribute("id",TestResult.tableName,TestId);
            if (loadedTestResult.rfid == rfid) {
                const existsTestDescriptor = await PersistentManager.exists(TestDescriptor.tableName, 'id', newIdTestDescriptor);
                if(existsTestDescriptor) {
                    let testToUpdate = {
                        idTestDescriptor: newIdTestDescriptor,
                        Date: newDate,
                        Result: newResult,
                    }
                    return PersistentManager.update(TestResult.tableName, testToUpdate, "id", TestId); 
                }
                else {
                    return Promise.reject("404 TestDescriptor id not found");
                }
            }
            else {
                return Promise.reject("404 rfid not found");
            }
        }
        else {
            return Promise.reject("404 TestResult id not found");
        }
    }

    
    async deleteTestResult(TestId,rfid) {
        /*
        let loadedTestResults = await PersistentManager.loadByMoreAttributes(TestResult.tableName,["rfid","id"],[rfid,TestId]);
        if (!loadedTestResults){
            return Promise.reject("404");
        }     */
         return PersistentManager.delete('id', TestId, TestResult.tableName);
     }
}


module.exports = new QualityTestManager();