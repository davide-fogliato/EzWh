'use strict';
const TestResult = require('../bin/model/TestResult');
const QualityTestManager = require('../bin/controller/QualityTestManager');
const { validationResult } = require('express-validator');

const dateValidation = function(date) {
    const yyyymmddRegex = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/);
    const withHours = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\s([0-1][0-9]|2[0-3]):[0-5]\d$/);
    if(yyyymmddRegex.exec(date) || withHours.exec(date)) {
        return true;
    }
    return false;
}

exports.postTestResultSchema = {
    rfid: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        },
        errorMessage: "rfid value incorrect"
    },
    idTestDescriptor: {
        notEmpty: true,
        isInt: {
            options: {min: 0}
        },
        errorMessage: "idTestDescriptor value incorrect"
    },
    Date: {
        notEmpty: true,
        errorMessage: "Date cannot be empty"
    },
    Result: {
        notEmpty: true,
        errorMessage: "Result cannot be empty"
    }
}

exports.postTestResult = async function(req,res) {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body or of rfid failed"
        });
    }
    


    let rfid = req.body.rfid;
    let Date = req.body.Date;
    let Result= req.body.Result;
    let idTestDescriptor= req.body.idTestDescriptor;
    
    
    //Date validation
    if (!dateValidation(Date)) {
        return res.status(422).json({error: "validation of request body or of rfid failed"});
    }

    await QualityTestManager.defineTestResult(rfid,Date,Result,idTestDescriptor).then( 
        result => {
            return res.status(201).end();
        },
        error => {
            switch (error) {
                case "404 rfid not found":
                    return res.status(404).json({error: "no sku item associated to rfid or no test descriptor associated to idTestDescriptor"});
                case "404 TestDescriptor not found":
                    return res.status(404).json({error: "no sku item associated to rfid or no test descriptor associated to idTestDescriptor"})
                default: 
                    return res.status(503).json({error: "generic error"});
            }
        }
    );
}

exports.getTestResultsSchema = {
    rfid: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        }
    },
}

exports.getTestResults = async function(req,res) {
        let rfid = req.params.rfid;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: "Validation of rfid failed"
            });
        }

        
    
        await QualityTestManager.getAllTestResultsByRFID(rfid).then(
            result => {
                    return res.status(200).json(result);
                
            },
            error => {
                switch (error) {
                    case "404": 
                        return res.status(404).json({error: "no sku item associated to rfid"});
                    default:
                        return res.status(500).json({error: 'generic error'});
                }
            }
        )
}

exports.getTestResultByIDSchema = {
    rfid: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        }
    },
    id: {
        notEmpty: true,
        isInt: 
            {options: {min: 0}}
    }
}
    
 exports.getTestResultByID = async function(req,res) {
  
        let id = req.params.id;
        let rfid = req.params.rfid;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: "Validation of id or rfid failed"
            });
        }
        
        await QualityTestManager.getTestResultByID(id,rfid).then(
            result => {
                if (result.length == 0) {
                    return res.status(404).json({error: "no test result associated to id or no sku item associated to rfid"});
                }
                else if (result) {
                    return res.status(200).json(result);
                }
            },
            error => {
                return res.status(500).json({error: 'generic error'});
        }
        )
}

exports.modifyTestResultByIdSchema = {
    newIdTestDescriptor: {
        notEmpty: true,
        isInt: {
            options: {min: 0}
        },
        errorMessage: "newIdTestDescriptor value incorrect"
    },
    newDate: {
        notEmpty: true,
        errorMessage: "newDate cannot be empty"
    },
    newResult: {
        notEmpty: true,
        errorMessage: "newResult cannot be empty"
    },
    rfid: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        }
    },
    id: {
        notEmpty: true,
        isInt: 
            {options: {min: 0}}
    }
}
    
 exports.modifyTestResultById = async function(req,res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body, of id or of rfid failed"
        });
    }

        const id = req.params.id;
        const rfid = req.params.rfid;
        const newIdTestDescriptor = req.body.newIdTestDescriptor;
        const newDate = req.body.newDate;
        const newResult = req.body.newResult;


        if (!dateValidation(newDate)) {
            return res.status(422).json({error: "validation of request body, of id or of rfid failed"});
        }
    
        await QualityTestManager.modifyTestResultByID(id,rfid, newIdTestDescriptor, newDate,  newResult).then(
            result => {
                return res.status(200).json();
            },
            error => {
                switch (error) {
                    case "404 rfid not found":
                        return res.status(404).json({error: "no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id"});
                        break;
                    case "404 TestDescriptor id not found":
                        return res.status(404).json({error: "no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id"});
                        break;
                    case "404 TestResult id not found":
                        return res.status(404).json({error: "no sku item associated to rfid or no test descriptor associated to newIdTestDescriptor or no test result associated to id"});
                        break;
                    default:
                        return res.status(503).json({error: "generic error"});
                        break;
                }
            }
        )
}


exports.deleteTestResultSchema = {
    rfid: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        }
    },
    id: {
        notEmpty: true,
        isInt: 
            {options: {min: 0}}
    }
}
    
    
exports.deleteTestResult =  async function (req,res) {
        const id = req.params.id;
        const rfid = req.params.rfid;

        const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of id or of rfid failed"
        });
    }

  
         await QualityTestManager.deleteTestResult(id,rfid).then(
            result => {
                return res.status(204).json();
            },
            error => {
                switch (error) {
                    /* Not requested
                    case "404":
                        return res.status(404).json({error: "TestResult not existing"});*/
                    default: 
                        return res.status(503).json({error: "generic error"});
                    
                }
            }
        )
 }
