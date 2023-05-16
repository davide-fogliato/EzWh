//need object
const PersistentManager = require('../DB/PersistentManager');
const InternalOrder = require('../model/InternalOrder')
const InternalOrderProduct = require('../model/InternalOrderProduct')
const SKUItem = require('../model/SKUItem')
const SKU = require('../model/SKU')
const User = require('../model/User')


class InternalOrderManager{
    constructor(){}

   async defineInternalOrder(date,productlist,customerId){
        
        //issued once created
        //save io , get ioid and take this with product in IOproduct table 

        //check xustomerId whether exists
		const customerExists = await PersistentManager.loadByMoreAttributes(
			User.tableName,
			["id", "type"],
			[customerId, "customer"]
		);

		
		if (customerExists.length === 0) {
			return Promise.reject("404 no customerId found");
		}




        let newIo = new InternalOrder(null,date,'ISSUED',customerId);
        let newIOid = await PersistentManager.store(InternalOrder.tableName, newIo);
        for(let i=0;i<productlist.length;i++){
            let product = productlist[i];
            let des = product.description;
            let pri = product.price;
            let qty = product.qty;
            let sku_id=product.SKUId;
            let newProduct = new InternalOrderProduct(null,des,pri,qty,sku_id,newIOid);
            PersistentManager.store(InternalOrderProduct.tableName, newProduct);
        }
        return newIOid;
    }


    async modifyState(rowID, newState,ProductList){
        const exists = await PersistentManager.exists(InternalOrder.tableName, 'id', rowID);
        if (!exists) {
            return Promise.reject("404 not found InternalOrder");
        }
        
        if(ProductList!=undefined&&newState==="COMPLETED"){ 
            for(let product of ProductList){
                let curProRFID=product.RFID;
                let curSkuID =product.SkuID;
                
                await PersistentManager.update(SKUItem.tableName,{"Available":0},"RFID",curProRFID)
                /*        
                let curSKU =  await PersistentManager.loadOneByAttribute("id",SKU.tableName,curSkuID)
                let curSKUqty = curSKU.availableQuantity;  
                           
                if (curSKUqty===0) {
                    return Promise.reject("Not available qty in DB")
                }
                else{                          
                    let resultqty = curSKUqty-1;                     
                    await PersistentManager.update(SKU.tableName, {"availableQuantity":resultqty},"id",curSkuID );                                        
                    }        */      
            }
        }   
        return PersistentManager.update(InternalOrder.tableName,{"state":newState},"id",rowID)
    }



    //need products list
    async listAllInternalOrder(){
        let originIos =  await PersistentManager.loadAllRows(InternalOrder.tableName);
       
        //each order
        let finalResult=[];     
        
        // let productInfo =[];
        for(let order of originIos){
            let orderInfo=[];
            //decide which info will be inserted into productlist
            if(order.state !=="COMPLETED"){
                //return SKUID ,desc,price,qty from IO product directly
                let products = await this.addProductsList(order);
                orderInfo={
                    "id":order.id,
                    "issueDate":order.date,
                    "state": order.state,
                    "products": products,
                    "customerId" :order.customer_id  
                }
            }
            else{
                   //find RFID SKUitem
                let RFIDRows = await PersistentManager.loadByMoreAttributes(SKUItem.tableName,['internalOrder_id','Available'],[order.id,0]);   
                
                let promises= RFIDRows.map(async p=>{
                    let iteminfo = await PersistentManager.loadByMoreAttributes(InternalOrderProduct.tableName,['sku_id','internalOrder_id'],[p.SKUId,order.id]);   
                    let product = {       
                        "SKUId":iteminfo[0].sku_id,
                        "description":iteminfo[0].description,
                        "price":iteminfo[0].price,
                        "RFID":p.RFID
                    };
                    return product;
                })   
                let productsList=[];            
                for(const prom of promises){
                    let item = await prom;
                    productsList.push(item);
                }     
                    
                orderInfo={
                    "id":order.id,
                    "issueDate":order.date,
                    "state": order.state,
                    "products": productsList,
                    "customerId" :order.customer_id    
                 }  
                       
            }          
            finalResult.push(orderInfo)
        }        
        return finalResult;
      
    }

    async   listIssuedIO(){
        let originIo = await PersistentManager.loadFilterByAttribute(InternalOrder.tableName,'state','ISSUED');
        let finalRes = [];
        for(let o of originIo){
            let productList = await this.addProductsList(o);
            let orderInfo={
                "id":o.id,
                "issueDate":o.date,
                "state": o.state,
                "products": productList,
                "customerId" :o.customer_id    
            }  
             finalRes.push(orderInfo);  
        }
        return finalRes;
    }

    async listAcceptedIO(){
        let originIo = await PersistentManager.loadFilterByAttribute(InternalOrder.tableName,'state','ACCEPTED');
        let finalRes = [];
        for(let o of originIo){
            let productList = await this.addProductsList(o);
            let orderInfo={
                "id":o.id,
                "issueDate":o.date,
                "state": o.state,
                "products": productList,
                "customerId" :o.customer_id    
            }  
             finalRes.push(orderInfo);  
        }
        return finalRes;
              
    }

    async listIOByID(id){
        const exists = await PersistentManager.exists(InternalOrder.tableName, 'id', id);
        if (!exists) {
            return Promise.reject("404 InternalOrderId cannot found");
        } 
        
        let io = await PersistentManager.loadOneByAttribute("id",InternalOrder.tableName,id);         
        
        let productList = await this.addProductsList(io);       
        
        let orderInfo={
            "id":io.id,
            "issueDate":io.date,
            "state": io.state,
            "products": productList,
            "customerId" :io.customer_id    
        }  
            return orderInfo;
           

    }


    async addProductsList(order){     
        let ProductList =[];
        let skuinfo={};
        let products = await PersistentManager.loadFilterByAttribute(InternalOrderProduct.tableName,'internalOrder_id',order.id);
        
        for(let p of products){
            
            skuinfo={
                "SKUId":p.sku_id,
                "description":p.description,
                "price":p.price,
                "qty":p.quantity
            }
            ProductList.push(skuinfo);

        }       
              
        return ProductList; 
    }

    async deleteIO(roId){
        // let Io = await this.listIOByID(roId);
        // //check validation
        // if(!Io){
        //     return Promise.reject("InternalOrder not exists")
        // }
        // // delete info in products table
        // if (Io.products){
        //     try{
        //         await PersistentManager.delete(internalOrder_id,roId,InternalOrderProduct.tableName)
        //     }
        //     catch{
        //         return Promise.reject("generic error")
        //     }
        // }

        return PersistentManager.delete('id',roId,InternalOrder.tableName)
    }



}

module.exports=new InternalOrderManager();