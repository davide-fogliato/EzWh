const SKU = require('../bin/model/SKU');
const SKUManager = require('../bin/controller/SKUManager');
const {validationResult} = require('express-validator');



exports.postSchema = {
    description: {
        notEmpty: true,
        errorMessage: "Description cannot be empty"
    },
    
    weight: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "weight value incorrect"
    },
    volume: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "volume value incorrect"
    },
    price: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "price value incorrect"
    },
    notes: {
        notEmpty: true,
        errorMessage: "notes value incorrect"
    },
    availableQuantity: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "available quantity value incorrect"
    }
}

exports.postSKU = async function(req,res) {
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body failed"
        });
    }

    let description = req.body.description;
    let weight = req.body.weight;
    let volume = req.body.volume;
    let price = req.body.price;
    let notes = req.body.notes;
    let availableQuantity = req.body.availableQuantity;


    await SKUManager.defineSKU(description, weight, volume, price, notes, availableQuantity).then( 
        result => {
            return res.status(201).end();
        },
        error => {
            return res.status(503).json({error: "generic error"});
        }
    );
}

exports.getSKUS = async function(req,res) {
    
    await SKUManager.listAllSKUs().then(
        result => {
            return res.status(200).json(result);
        },
        error => {
            return res.status(500).json({error: "generic error"});
        }
    )
}

exports.getSKUByIDSchema = {
    id: {
        notEmpty: true,
        isInt: {options: {min:0}}
    }
}


exports.getSKUByID = async function(req,res) {
    let id = req.params.id;
    

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of id failed"
        });
    }
    await SKUManager.getSKUByID(id).then(
        result => {
            
                return res.status(200).json(result);

        },
        error => {
            switch (error) {
                
                case "404 sku": 
                    return res.status(500).json({error: "No SKU associated to id"});
                default: 
                    return res.status(500).json({error: "generic error"});  
            }
            
        }
    )
}


exports.modifySKUByIdSchema = {
    newDescription: {
        notEmpty: true,
        errorMessage: "Description cannot be empty"
    },
    
    newWeight: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "weight value incorrect"
    },
    newVolume: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "volume value incorrect"
    },
    newPrice: {
        notEmpty: true,
        isFloat: {
            options: { min: 0}
        },
        errorMessage: "price value incorrect"
    },
    newNotes: {
        notEmpty: true,
        errorMessage: "notes value incorrect"
    },
    newAvailableQuantity: {
        notEmpty: true,
        isInt: {
            options: { min: 0}
        },
        errorMessage: "available quantity value incorrect"
    },
    id: {
        notEmpty: true,
        isNumeric: {
            options: {min: 0}
        }
    }
}

exports.modifySKUById = async function(req,res) {
    
    const errors = validationResult(req);
   

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume"
        });
    }

    
    const id = req.params.id;
    const newDescription = req.body.newDescription;
    const newWeight = req.body.newWeight;
    const newVolume = req.body.newVolume;
    const newPrice = req.body.newPrice;
    const newNotes = req.body.newNotes;
    const newQuantity = req.body.newAvailableQuantity;

    await SKUManager.modifySKU(id, newDescription, newWeight, newVolume, newPrice, newNotes, newQuantity).then(
        result => {
            return res.status(200).end();
            
        },
        error => {
            switch (error) {
                case "404":
                    return res.status(404).json({error: "SKU not existing"});
                    break;
                case "422 position not capable":
                    return res.status(422).json({error: "validation of request body failed or if with newAvailableQuantity position is not capable enough in weight or in volume"});
                    break;
                default:
                    return res.status(503).json({error: "generic error"});
                    break;
            }
        }
    )
}

exports.putPositionToSkuSchema = {
    position: {
        isNumeric: true,
        isLength: {
            options: {min: 12, max: 12}
        }
    }
}

exports.putPositionToSku = async function(req,res) {
    const id = req.params.id;
    const position = req.body.position;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of position through the algorithm failed or position isn't capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku"
        });
    }

    
    await SKUManager.setPosition(id, position).then(
        result => {
            return res.status(200).end();
        },
        error => { 
            switch (error) {
                case "404 position":
                    return res.status(404).json({error: "Position not existing or SKU not existing"});
                    break;
                case "404 SKU":
                    return res.status(404).json({error: "Position not existing or SKU not existing"});
                    break;
                case "422 position not capable":
                    return res.status(422).json({error: "validation of position through the algorithm failed or position isn't capable to satisfy volume and weight constraints for available quantity of sku or position is already assigned to a sku"});
                    break;
                default:
                    return res.status(503).json({error: "generic error"});
                    break;
            }
        }
    )
}

exports.deleteSKUSchema = {
    id: {
        notEmpty: true,
        isNumeric: {options: {min:0}}
    }
}

exports.deleteSKU =  async function (req,res) {
    

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of id failed"
        });
    }

    const skuid = req.params.id;

    await SKUManager.deleteSKU(skuid).then(
        result => {
            return res.status(204).end();
        },
        error => {
            
            return res.status(503).json({error: "generic error"});
        }
    )
}