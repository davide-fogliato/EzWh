'use strict';
const Item = require('../bin/model/Item');
const ItemManager = require('../bin/controller/ItemManager');
const {validationResult} = require('express-validator');

exports.postItemSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min:0}}
    },
    description: {
        notEmpty: true,
        errorMessage: "description cannot be empty"
    },
    
    price: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "price value incorrect"
    },
    SKUId: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "SKUId value incorrect"
    },
    supplierId: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "supplierId value incorrect"
    }
}

exports.postItem = async function(req,res) {
    const errors = validationResult(req);
    


    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID"
        });
    }
    let id = req.body.id;
    let description = req.body.description;
    let price = req.body.price;
    let SKUId= req.body.SKUId;
    let supplierId= req.body.supplierId;


    await ItemManager.defineItem(id, description,price,SKUId,supplierId).then( 
        result => {
            return res.status(201).json();
        },
        error => {
            switch (error) {
                case "404 SKU not found":
                    return res.status(404).json({error: "Sku not found"});
                    break;
                case "404 Supplier not found":
                    return res.status(404).json({error: "Supplier not found"});
                    break;
                case "422 supplier already sells an Item with the same ID":
                    return res.status(422).json({error: "validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID"});
                    break;
                case "422 this supplier already sells an item with the same SKUId":
                    return res.status(422).json({error: "validation of request body failed or this supplier already sells an item with the same SKUId or supplier already sells an Item with the same ID"});
                    break;
                default:
                    console.log(error);
                    return res.status(503).json({error: "generic error"});
                    break;
            }
        }
    );
}

exports.getItems = async function(req,res) {
    
        await ItemManager.getAllItems().then(
            result => {
                return res.status(200).json(result);
            },
            error => {
                return res.status(500).json({error: 'generic error'});
            }
        )
 }

 exports.getItemByIDSchema = {
     id: {
         notEmpty: true,
         isInt: {options: {min: 0}}
     }, 
     supplierId: {
         notEmpty: true,
         isInt: {options: {min: 0}}
     }
 }
    
exports.getItemByID = async function(req,res) {
        let id = req.params.id;
        let supplierId = req.params.supplierId;

        const errors = validationResult(req);
        

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: "validation of id failed"
            });
        }
        
        await ItemManager.getItemByID(id, supplierId).then(
            result => {
                if (result) {
                    return res.status(200).json(result);
                }
                else {
                    return res.status(404).json({error: "no item associated to id"});
                }
            },
            error => {
                return res.status(500).json({error: 'Generic error'});
            }
        )
 }

exports.modifyItemByIdSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min:0}}
    },
    supplierId: {
        notEmpty: true,
        isInt: {options: {min:0}}
    },
    newDescription: {
        notEmpty: true,
        errorMessage: "newDescription cannot be empty"
    },
    
    newPrice: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "price value incorrect"
    }
}
    
exports.modifyItemById = async function(req,res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body failed"
        });
    }
        const id = req.params.id;
        const supplierId = req.params.supplierId;
        const newDescription = req.body.newDescription;
        const newPrice = req.body.newPrice;
    
        await ItemManager.modifyItem(id, supplierId, newDescription, newPrice).then(
            result => {
                    return res.status(200).json(result);
            },
            error => {
                switch (error) {
                    case "404":
                        return res.status(404).json({error: "Item not existing"});
                    default:
                        return res.status(503).json({error: 'Generic error'});
                }
            }
        )
}
    

exports.deleteItemSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min: 0}}
    },
    supplierId: {
        notEmpty: true,
        isInt: {options: {min: 0}}
    }

}
exports.deleteItem = async function (req,res) {
        const id = req.params.id;
        const supplierId = req.params.supplierId;
        
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: "validation of id failed"
            });
        }
  
        await ItemManager.deleteItem(id, supplierId).then(
            result => {
                return res.status(204).json();
            },
            error => {
                switch (error) {
                    /*Not requested
                    case "404":
                        return res.status(404).json({error: "Item not existing"})*/
                    default: 
                        return res.status(503).json({error: "generic error"})
                    
                }
            }
        )
 }



