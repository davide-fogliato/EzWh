'use strict';
const express = require('express');
const position = require('./api/positionAPI');
const sku = require('./api/skuAPI');
const skuItem = require('./api/skuItemAPI');
const testDescriptor = require('./api/testDescriptorAPI');
const testResult = require('./api/testResultAPI');
const PersistentManager = require('./bin/DB/PersistentManager');
const { checkSchema } = require('express-validator');
const internalOrders = require('./api/internalOrderAPI');
const restockOrders = require('./api/restockOrdersAPI');
const returnOrders = require('./api/returnOrdersAPI')
const user = require('./api/userAPI');
const item = require('./api/itemAPI');
const utility = require('./bin/utility/utility');
const dbstructure = require('./bin/DB/DatabaseStructure');
// init express
const app = new express();
const port = 3001;




app.use(express.json());

//POSITION

//POST /api/position
app.post('/api/position', checkSchema(position.postPositionSchema) ,position.postPosition);

//GET /api/positions
app.get('/api/positions', position.getPositions);

//PUT /api/positions/:positionID
app.put('/api/position/:positionID', checkSchema(position.updatePositionSchema), position.updatePosition);

//PUT /api/position/:positionID/changeID
app.put('/api/position/:positionID/changeID', checkSchema(position.changePositionIDSchema),position.changePositionID);

//DELETE /api/position/:positionID
app.delete('/api/position/:positionID', checkSchema(position.deletePositionSchema),position.deletePosition);

//SKU

//POST /api/sku
app.post('/api/sku', checkSchema(sku.postSchema), sku.postSKU);

//GET /api/skus
app.get('/api/skus', sku.getSKUS);

//GET /api/skus/:id
app.get('/api/skus/:id', checkSchema(sku.getSKUByIDSchema), sku.getSKUByID);

//PUT /api/sku/:id
app.put('/api/sku/:id', checkSchema(sku.modifySKUByIdSchema), sku.modifySKUById);

//PUT /api/sku/:id/position
app.put('/api/sku/:id/position', checkSchema(sku.putPositionToSkuSchema), sku.putPositionToSku)

//DELETE /api/skus/:id
app.delete('/api/skus/:id', checkSchema(sku.deleteSKUSchema), sku.deleteSKU);

//SKUItem

//GET /api/skuitems
app.get('/api/skuitems', skuItem.getSKuItems);

//GET /api/skuitems/sku/:id
app.get('/api/skuitems/sku/:id', checkSchema(skuItem.getSKUItemBySKUSchema), skuItem.getSkuItemsBySKU);

//GET /api/skutiems/:rfid
app.get('/api/skuitems/:rfid', checkSchema(skuItem.getSKUItemByRfidSchema), skuItem.getSKUItemByRfid);

//POST /api/skuitem
app.post('/api/skuitem', checkSchema(skuItem.postSkuItemSchema) , skuItem.postSkuItem);

//PUT /api/skuitems/:rfid
app.put('/api/skuitems/:rfid', checkSchema(skuItem.putSkuItemSchema), skuItem.putSkuItem);

//DELETE /api/skuitems/:rfid

app.delete('/api/skuitems/:rfid', checkSchema(skuItem.deleteSKUItemSchema),skuItem.deleteSkuItem);

//TEST DESCRIPTOR

//POST /api/testDescriptor
app.post('/api/testDescriptor',checkSchema(testDescriptor.postTestDescriptorSchema) ,testDescriptor.postTestDescriptor);

//GET /api/testDescriptors
app.get('/api/testDescriptors',  testDescriptor.getTestDescriptors);

//GET /api/testDescriptors/:id
app.get('/api/testDescriptors/:id', checkSchema(testDescriptor.getTestDescriptorByIDSchema), testDescriptor.getTestDescriptorByID);

//PUT /api/testDescriptor/:id
app.put('/api/testDescriptor/:id', checkSchema(testDescriptor.modifyTestDescriptorByIdSchema),  testDescriptor.modifyTestDescriptorById);

//DELETE /api/testDescriptor/:id
app.delete('/api/testDescriptor/:id', checkSchema(testDescriptor.deleteTestDescriptorSchema) ,  testDescriptor.deleteTestDescriptor);

//TEST RESULT

//POST /api/skuitems/testResult
app.post('/api/skuitems/testResult',checkSchema(testResult.postTestResultSchema), testResult.postTestResult);

//GET /api/skuitems/:rfid/testResults
app.get('/api/skuitems/:rfid/testResults',  checkSchema(testResult.getTestResultsSchema) ,testResult.getTestResults);

//GET /api/skuitems/:rfid/testResults/:id
app.get('/api/skuitems/:rfid/testResults/:id',  checkSchema(testResult.getTestResultByIDSchema),testResult.getTestResultByID);

//PUT /api/skuitems/:rfid/testResult/:id
app.put('/api/skuitems/:rfid/testResult/:id',checkSchema(testResult.modifyTestResultByIdSchema),  testResult.modifyTestResultById);

//DELETE /api/skuitems/:rfid/testResult/:id
app.delete('/api/skuitems/:rfid/testResult/:id', checkSchema(testResult.deleteTestResultSchema) ,testResult.deleteTestResult);

 


//InternalOrder
//GET /api/InternalOrders  
app.get('/api/internalOrders', internalOrders.getAllInternalOrder)

//GET /api/internalOrdersIssued 
app.get('/api/internalOrdersIssued', internalOrders.getInternalOrderIssued)

//GET /api/internalOrdersAccepted 
app.get('/api/internalOrdersAccepted', internalOrders.getinternalOrdersAccepted);

//GET /api/internalOrders/:id 
app.get('/api/internalOrders/:id', checkSchema(internalOrders.getinternalOrderByIdSchema),internalOrders.getinternalOrderById);

//POST /api/internalOrders  
app.post('/api/internalOrders', checkSchema(internalOrders.postInternalOrderSchema), internalOrders.postInternalOrder);

//DELETE /api/internalOrdersIssued  
app.delete('/api/internalOrders/:id',checkSchema(internalOrders.deleteInternalOrderSchema), internalOrders.deleteInternalOrder);

//PUT /api/internalOrders/:id   
app.put('/api/internalOrders/:id', checkSchema(internalOrders.putInternalOrdersSchema),internalOrders.changeInternalOrder);


//RestockOrder
//POST /api/restockOrder 
app.post('/api/restockOrder', checkSchema(restockOrders.postRestockOrderSchema),restockOrders.postRestockOrder);

//DELETE /api/restockOrder/:id 
app.delete('/api/restockOrder/:id', checkSchema(restockOrders.deleteRestockOrderSchema), restockOrders.deleteRestockOrder);

//GET /api/restockOrders 
app.get('/api/restockOrders', restockOrders.getRestockOrder);

//GET /api/restockOrdersIssued
app.get('/api/restockOrdersIssued', restockOrders.getRestockIssuedOrder);

//GET /api/restockOrders/:id
app.get('/api/restockOrders/:id', checkSchema(restockOrders.getRestockOrderByIDSchema), restockOrders.getRestockOrderById);

//GET /api/restockOrders/:id/returnItems
app.get('/api/restockOrders/:id/returnItems', checkSchema(restockOrders.getItemsByIdSchema),restockOrders.getItemsById);

//PUT /api/restockOrder/:id 
app.put('/api/restockOrder/:id',checkSchema(restockOrders.putStateSchema ),restockOrders.updateState );

//PUT /api/restockOrder/:id/skuItems
app.put('/api/restockOrder/:id/skuItems',checkSchema(restockOrders.putSKUItemsSchema ),restockOrders.updateSKUItems );

//PUT /api/restockOrder/:id/transportNote  update and use transport id to update transport node(1 to 1)
app.put('/api/restockOrder/:id/transportNote', checkSchema(restockOrders.putTransportNoteSchema ),restockOrders.addTransportNode);

//GET api/restockOrders/:id/returnItems   
app.get('/api/restockOrders/:id', checkSchema(restockOrders.deleteRestockOrderSchema) ,restockOrders.getRestockOrder);

//ReturnOrder
//GET /api/returnOrders  
app.get('/api/returnOrders', returnOrders.getAllReturnOrders)

//GET /api/returnOrders/:id 
app.get('/api/returnOrders/:id', checkSchema(returnOrders.getAllReturnOrderByIdSchema),returnOrders.getAllReturnOrderById)

//POST /api/returnOrder 
app.post('/api/returnOrder', checkSchema(returnOrders.postReturnOrderSchema),returnOrders.postReturnOrder);

//DELETE /api/returnOrder/:id 
app.delete('/api/returnOrder/:id', checkSchema(returnOrders.deleteReturnOrderSchema),returnOrders.deleteReturnOrder);


//USER

app.get('/api/userinfo', user.getUserInfo);

app.get('/api/suppliers', user.getSuppliers);

app.get('/api/users', user.getUsers);

app.post('/api/newUser', checkSchema(user.postUserSchema), user.postUser);

app.post('/api/managerSessions', user.managerSessions);

app.post('/api/customerSessions', user.customerSessions);

app.post('/api/supplierSessions', user.supplierSessions);

app.post('/api/clerkSessions', user.clerkSessions);

app.post('/api/qualityEmployeeSessions', user.qualityEmployeeSessions);

app.post('/api/logout', user.logout);

app.put('/api/users/:username', checkSchema(user.putUserSchema), user.putUser);

app.delete('/api/users/:username/:type', checkSchema(user.deleteUserSchema), user.deleteUser);

//ITEM

//POST /api/item
app.post('/api/item',checkSchema(item.postItemSchema), item.postItem);

//GET /api/items
app.get('/api/items',  item.getItems);

//GET /api/items/:id/:supplierId
app.get('/api/items/:id/:supplierId',  checkSchema(item.getItemByIDSchema),item.getItemByID);

//PUT /api/item/:id/:supplierId
app.put('/api/item/:id/:supplierId',checkSchema(item.modifyItemByIdSchema), item.modifyItemById);

//DELETE /api/items/:id/:supplierId
app.delete('/api/items/:id/:supplierId', checkSchema(item.deleteItemSchema) ,item.deleteItem);



//activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});



module.exports = app;