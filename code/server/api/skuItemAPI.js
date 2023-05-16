'use strict'
const SKUItem = require('../bin/model/SKUItem');
const SKUItemManager = require('../bin/controller/SKUItemManager');
const PersistentManager = require('../bin/DB/PersistentManager');
const { validationResult } = require('express-validator');

const dateValidation = function(date) {
    const yyyymmddRegex = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/);
    const withHours = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\s([0-1][0-9]|2[0-3]):[0-5]\d$/);
    if(yyyymmddRegex.exec(date) || withHours.exec(date)) {
        return true;
    }
    return false;
}

exports.postSkuItemSchema = {
    RFID: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        }
    },
    SKUId: {
        notEmpty: true,
        isNumeric: {
            options: {min: 0}
        }
    },
    DateOfStock: {
        notEmpty: true,
    }
}
exports.postSkuItem = async function(req,res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }

    const rfid = req.body.RFID;
    const SKUId = req.body.SKUId;
    const dateOfStock = req.body.DateOfStock;

    //Date validation
    if (!dateValidation(dateOfStock)) {
        return res.status(422).json({error: "Validation of request body failed"});
    }


    await SKUItemManager.defineSKUItem(rfid, SKUId, dateOfStock).then(
        result => {
            return res.status(201).end();
        },
        error => {
            switch (error) {
                case "404 SKU":
                    return res.status(404).json({error: "No SKU associated to SKUId"});
                case "422 duplicate":
                    return res.status(503).json({error: "generic error"})
                default: 
                    return res.status(503).json({error: "generic error"});
            }
        }
    );
    

}



exports.getSKuItems = async function (req,res) {
    await SKUItemManager.listAllSKUItems().then(
        result => {
            //Remove the unnecessary fields for the apis
            result.forEach(skuitem => {
                delete skuitem.internalOrder_id;
                delete skuitem.restockOrder_id
                delete skuitem.returnOrder_id
                delete skuitem.testResult_id
            });
            return res.status(200).json(result);
        },
        error => {
            return res.status(500).json({error: "generic error"});
        }
    );
}

exports.getSKUItemBySKUSchema = {
    id: {
        notEmpty: true,
        isInt: {
            options: {min: 0}
        }
    }
}

exports.getSkuItemsBySKU = async function (req,res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of id failed"
        });
    }

    let skuId = req.params.id;
    await SKUItemManager.listForSKU(skuId).then(
        result => {
            //Remove the unnecessary fields for the apis
            result.forEach(skuitem => {
                delete skuitem.internalOrder_id;
                delete skuitem.restockOrder_id;
                delete skuitem.returnOrder_id;
                delete skuitem.testResult_id;
                delete skuitem.Available;
            });
            return res.status(200).json(result);
        },
        error => {
            switch (error) {
                case "404 sku":
                    return res.status(404).json({error: "No SKU associated to id"});
                default:
                    return res.status(503).json({error: "generic error"});
            }
        }
    )
}

exports.getSKUItemByRfidSchema = {
    rfid: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        }
    }
}

exports.getSKUItemByRfid = async function (req,res) {
    let rfid = req.params.rfid;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of rfid failed"
        });
    }

    await SKUItemManager.searchByRFID(rfid).then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            switch (error) {
                case "404 rfid":
                    return res.status(404).json({error: "No SKU Item associated to rfid"})
                default:
                    return res.status(500).json({error: "generic error"});
            }
        }
    );

}

exports.putSkuItemSchema = {
    rfid: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        }
    },
    newRFID: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        }
    },
    newAvailable: {
        notEmpty: true,
        isInt: {
            options: {min: 0, max: 1}
        }

    },
    newDateOfStock: {
        notEmpty: true,
        
    }
}

exports.putSkuItem = async function (req,res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body or rfid failed"
        });
    }

    let rfid = req.params.rfid;
    let newRFID = req.body.newRFID;
    let newAvailable = req.body.newAvailable;
    let newDateOfStock = req.body.newDateOfStock;

    //Date validation
    if (!dateValidation(newDateOfStock)) {
        return res.status(422).json({error: "date validation failed"});
    }


    await SKUItemManager.modifySKUItem(rfid, newRFID, newAvailable, newDateOfStock).then(
        result => {
            return res.status(200).end()
        },
        error => {
            switch (error) {
                case "404 rfid": 
                    return res.status(404).json({error: "No SKU Item associated to RFID"});
                default:
                    return res.status(503).json({error: "generic error"});
            }
            
        }
    );
}

exports.deleteSKUItemSchema = {
    rfid: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        }
    }
}

exports.deleteSkuItem =  async function (req,res) {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of rfid failed"
        });
    }

    let rfid = req.params.rfid;

    await SKUItemManager.deleteSKUItem(rfid).then(
        result => {
            return res.status(204).end();
        },
        error => {
            return res.status(503).json({error: "generic error"});
        }
    );
}