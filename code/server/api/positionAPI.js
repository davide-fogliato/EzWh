'use strict';
const PositionManager = require('../bin/controller/PositionManager');
const Position = require('../bin/model/Position');
const {validationResult} = require('express-validator');


exports.postPositionSchema = {
    positionID: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 12, max: 12}
        }
    },
    aisleID: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 4, max: 4}
        }
    },
    row: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 4, max: 4}
        }
    },
    col: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 4, max: 4}
        }
    },
    maxWeight: {
        notEmpty: true,
        isFloat: {
            options: {min: 0}
        }
    },
    maxVolume: {
        notEmpty: true,
        isFloat: {
            options: {min: 0}
        }
    },
}

//POST /api/position
exports.postPosition = async function(req,res) {
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            //error: errors.array()
            error: "Validation of request body failed"
        });
    }

    let positionID = req.body.positionID;
    let aisleID = req.body.aisleID;
    let row = req.body.row;
    let col = req.body.col;
    let maxWeight =  req.body.maxWeight;
    let maxVolume = req.body.maxVolume;

    let p = new Position(positionID, aisleID, row, col, maxWeight, maxVolume);
    const isIdValid = p.isIdValid()

    if (!isIdValid) {
        return res.status(422).json({error: 'validation of request body failed'});
    }
    

    
    await PositionManager.definePosition(positionID, aisleID, row, col, maxWeight, maxVolume).then(
        result => {
            return res.status(201).end();
        },
        error => {
            return res.status(503).json({error: 'generic error'})
        }
    )

};



exports.getPositions = async function(req,res) {
    await PositionManager.listAllPositions().then(
        result => {
            result.forEach((p) => {
                delete p.sku_id
            });
            return res.status(200).json(result);
        },
        error => {
            return res.status(500).json({error: 'generic error'})
            
        }
    )
    
}


exports.updatePositionSchema = {
    positionID: {
        notEmpty: true,
        isNumeric: true,
        isLength: {options: {min:12, max:12}}
    },
    newAisleID: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 4, max: 4}
        }
    },
    newRow: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 4, max: 4}
        }
    },
    newCol: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 4, max: 4}
        }
    },
    newMaxWeight: {
        notEmpty: true,
        isFloat: {
            options: {min: 0}
        }
    },
    newMaxVolume: {
        notEmpty: true,
        isFloat: {
            options: {min: 0}
        }
    },
    newOccupiedWeight: {
        notEmpty: true,
        isFloat: {
            options: {min: 0}
        }
    },
    newOccupiedVolume: {
        notEmpty: true,
        isFloat: {
            options: {min: 0}
        }
    },

}


exports.updatePosition = async function(req,res) {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            //error: errors.array()
            error: "validation of request body or of positionID failed"
        });
    }
    
    let id= req.params.positionID;
    let aisle= req.body.newAisleID;
    let row= req.body.newRow;
    let col= req.body.newCol;
    let max_weight= req.body.newMaxWeight;
    let max_volume= req.body.newMaxVolume;
    let occupied_weight= req.body.newOccupiedWeight;
    let occupied_volume= req.body.newOccupiedVolume;


    let p = new Position(aisle+row+col, aisle, row, col, max_weight, max_volume, occupied_weight, occupied_volume);
    const isIdValid = p.isIdValid()

    if (!isIdValid) {
        return res.status(422).json({error: 'validation of request body or of positionID failed'});
    }

    await PositionManager.modifyPosition(id, aisle, row, col, max_weight, max_volume, occupied_weight, occupied_volume).then( 
        result => {
            return res.status(200).json();
        },
        error => {
            switch (error) {
                /*
                case "422 cant store sku":
                    return res.status(503).json({error: 'generic error'});*/
                case "404 position":
                    return res.status(404).json({error: 'no position associated to positionID'});
                default:
                    return res.status(503).json({error: 'generic error'})
            }
        }
    )

}

exports.changePositionIDSchema = {
    positionID: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 12, max: 12}
        }
    },
    newPositionID: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 12, max: 12}
        }
    }
}

exports.changePositionID = async function(req,res) {
    let id= req.params.positionID;
    let newID = req.body.newPositionID;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of request body or of positionID failed"
        });
    }
    

    await PositionManager.changePositionID(id, newID).then(
        result => {
            return res.status(200).json();
        },
        error => {
            switch (error) {
                case "404 position":
                    return res.status(404).json({error: 'no position associated to positionID'});
                default:
                    return res.status(503).json({error: 'generic error'})
            }
        }
    )

}

exports.deletePositionSchema = {
    positionID: {
        notEmpty: true,
        isNumeric: true,
        isLength: {
            options: {min: 12, max: 12}
        }
    },
}

exports.deletePosition = async function(req,res) {
    let id= req.params.positionID;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: "validation of positionID failed"
        });
    }
    
    await PositionManager.deletePosition(id).then(
        result => {
            return res.status(204).end();
        },
        error => {
            return res.status(503).json({error: 'generic error'})
        }
    )
}

