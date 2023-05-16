'use strict'
const ReturnOrderManager = require('../bin/controller/ReturnOrderManager');
const ReturnOrder = require('../bin/model/ReturnOrder')
const { validationResult } = require('express-validator');
const RestockOrder = require('../bin/model/RestockOrder');
const { checkSchema } = require('express-validator');



//getall
exports.getAllReturnOrders= async function(req,res){
    await  ReturnOrderManager.listAllReturnOrders().then(
        result=>{
            return res.status(200).json(result);
        },
        error=>{
            return res.status(500).json({error:"generic error"})
        }
    )

}

exports.getAllReturnOrderByIdSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min:0}}
    }
}

//getbyid
exports.getAllReturnOrderById = async function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of id failed"
        });
    }
    let returnOId = req.params.id;
    
    await ReturnOrderManager.getReturnOrderByID(returnOId).then(
        result=>{
            return res.status(200).json(result);
        },
        error=>{
            switch(error){
                case "404 ReturnOrderid cannot found":
                    return res.status(404).json({error: "no return order associated to id"})
            
                default:     
                    return res.status(500).json({error: "generic error"});
            }
            
            
        }
    )
}

const dateValidation = function(date) {
    const yyyymmddRegex = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])$/);
    const withHours = new RegExp(/^\d{4}\/(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\s([0-1][0-9]|2[0-3]):[0-5]\d$/);
    if(yyyymmddRegex.exec(date) || withHours.exec(date)) {
        return true;
    }
    return false;
}

exports.postReturnOrderSchema = {
    returnDate: {
        notEmpty: true,
    },
    products: {
        notEmpty: true,
        isArray: true,
    },
    'products.*.SKUId': {
        notEmpty: true, 
        isNumeric: {
            options: {min: 0}
        }
    },
    'products.*.itemId': {
        notEmpty: true, 
        isNumeric: {
            options: {min: 0}
        }
    },
    'products.*.description': {
        notEmpty: true
    },
    'products.*.price': {
        notEmpty: true,
        isNumeric: true
    },
    'products.*.RFID': {
        notEmpty: true, 
        isNumeric: true,
        isLength: {
            options: {min: 32, max: 32}
        }
    },
    restockOrderId: {
        notEmpty: true,
        isNumeric: {
			options: {min: 0}
		}
    }
}
//post
exports.postReturnOrder=async function(req,res){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of request body failed"
        });
    }
    let date = req.body.returnDate;
    let roId = req.body.restockOrderId;
    let productsList = req.body.products;

    if (!dateValidation(date)) {
        return res.status(422).json({error: "Validation of request body failed"});
    }

    await ReturnOrderManager.defineReturnOrder( date,productsList,roId).then(
        result=>{
            return res.status(201).json();
        },
        error=>{
            switch(error){
                case "404 not found restockOrderId":
                    return res.status(404).json({error: "no restock order associated to restockOrderId"})
            
                
                default:     
                    return res.status(503).json({error: "generic error"});
            }
        }
    )
}

exports.deleteReturnOrderSchema = {
    id: {
        isInt: {
            options: {
                min: 0
            }
        }
    }
}

//delete
exports.deleteReturnOrder= async function(req,res){
    
    let returnOID= req.params.id;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "Validation of id failed"
        });
    }  
    await ReturnOrderManager.deleteReturnOrder(returnOID).then(
        result=>{          
            return res.status(204).end();
        }, 
        error=>{
            return res.status(500).json({error:"generic error"});
        }
    )
}
//