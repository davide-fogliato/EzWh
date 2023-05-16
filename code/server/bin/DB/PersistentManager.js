const sqlite = require("sqlite3");

class PersistentManager {
	constructor() {
		this.dbName = "ezwh.db";
	}

	store(tableName, object) {
		return new Promise((resolve, reject) => {
			//names of the attributes of the objects
			let attributesName = [];
			//Values of the attributes
			let attributesValue = [];

			//Loop through all the object attributes and push them into the arrays
			for (var prop in object) {
				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					attributesName.push(prop);
					attributesValue.push(object[prop]);
				}
			}

			const placeHoldersArray = attributesName.map((val) => "?");
			const sql =
				"INSERT INTO " +
				tableName +
				"(" +
				attributesName.join(",") +
				") VALUES (" +
				placeHoldersArray.join(",") +
				")";
			//const sql = "INSERT INTO " + tableName + " VALUES (?,?)"

			const db = new sqlite.Database(this.dbName, (err) => {
				if (err) {
					reject(err);
					return;
				}
			});
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

			db.run(sql, attributesValue, function(err) {
				if (err) {
					reject(err);
					return;
				}
				resolve(this.lastID);
			});
			db.close();
		});
	}

	loadAllRows(tableName) {
		return new Promise((resolve, reject) => {
			const sql = "SELECT * FROM " + tableName;
			const db = new sqlite.Database(this.dbName, (err) => {
				if (err) {
					reject(err);
					return;
				}
			});
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

			db.all(sql, (err, rows) => {
				if (err) {
					reject(err);
					return;
				}
				resolve(rows);
			});
			db.close();
		});
	}


   	async delete(attribute_name ,id, tableName) {
        return new Promise ((resolve, reject) => {
            const sql = "DELETE FROM " + tableName + " WHERE "+ attribute_name + "= ?";
            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

			
			db.run(sql, id, (err) => {if (err) reject(err); resolve(); } )
			db.close();
			
        })
    }

	async deleteByTwoAttrs(attribute_names ,values, tableName) {
        return new Promise ((resolve, reject) => {
			
            const sql = "DELETE FROM " + tableName + " WHERE "+ attribute_names[0] + "= ? AND " + attribute_names[1] + "= ?" ;
            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

			
			db.run(sql, [values[0], values[1]], (err) => {if (err) reject(err); resolve(); } )
			db.close();
			
        })
    }

    async loadOneByAttribute(parameter_name, tableName, value ){
        return new Promise ((resolve, reject) => {
            const sql = "SELECT * FROM " + tableName + " WHERE " + parameter_name + "= ?";
            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

            db.get(sql, value, (err, row) => {if (err) reject(err); resolve(row); } )
            db.close();
        })
    }


    async update(tableName, object, attribute_name, id) {
        return new Promise ((resolve, reject) => {
            //names of the attributes of the objects
			let attributesName = [];
			//Values of the attributes
			let attributesValue = [];

			//Loop through all the object attributes and push them into the arrays
			for (var prop in object) {
				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					attributesName.push(prop + "= ?");
					attributesValue.push(object[prop]);
				}
			}


            const sql = "UPDATE " + tableName +
                        " SET " + attributesName.join(",") + 
                        " WHERE " + attribute_name + " = ?";
			
		

            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

            db.run(sql, [...attributesValue, id], (err) => {
                if (err) 
					reject(err);
				
				
                resolve();
            });
            db.close();
        }) 
    }

	async updateByTwoAttributes(tableName, object, attribute_names, values) {
        return new Promise ((resolve, reject) => {
            //names of the attributes of the objects
			let attributesName = [];
			//Values of the attributes
			let attributesValue = [];

			//Loop through all the object attributes and push them into the arrays
			for (var prop in object) {
				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					attributesName.push(prop + "= ?");
					attributesValue.push(object[prop]);
				}
			}


            const sql = "UPDATE " + tableName +
                        " SET " + attributesName.join(",") + 
                        " WHERE " + attribute_names[0] + " = ? AND " + attribute_names[1] + " = ?";
			
		

            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

            db.run(sql, [...attributesValue, values[0], values[1]], (err) => {
                if (err) 
					reject(err);
				
				
                resolve();
            });
            db.close();
        }) 
    }


    async loadFilterByAttribute(tableName, parameterName, value) {
        return new Promise ((resolve, reject) => {
            const sql = "SELECT * FROM " + tableName + " WHERE " + parameterName + "= ?";
            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

            db.all(sql, value, (err,rows) => {if (err) reject(err); resolve(rows); } )
            db.close();
        })
    }

	async loadByMoreAttributes(tableName, parametersName, values) {
		return new Promise ((resolve, reject) => {
			const placeHolders = parametersName.map( v => {
				return v + " = ?"
			})
			const sql = "SELECT * FROM " + tableName + " WHERE " + placeHolders.join(' AND ');
			const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

			db.all(sql, values, (err,rows) => {if (err) reject(err); resolve(rows); } );
			db.close();
		})
	}

	
	async loadOneByAttributeSelected(tableName, parameter_name, value, selectedNames) {
		return new Promise ((resolve, reject) => {
			const selectedAttributes = selectedNames.join(',');
			const sql = "SELECT " + selectedAttributes + " FROM " + tableName + " WHERE " + parameter_name + "= ?";
            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

            db.get(sql, value, (err, row) => {if (err) reject(err); resolve(row); } )
            db.close();
		})
	}

	async exists(tableName, parameter_name, value) {
		try {
			let row = await this.loadOneByAttribute(parameter_name, tableName, value);
			if (row) {
				return true;
			}
			else {
				return false;
			}
		}
		catch (err) {
			return Promise.reject(err);
		}
	}

	async deleteAll(tableName) {
		return new Promise ((resolve, reject) => {
			const sql = "DELETE FROM " + tableName;
            const db = new sqlite.Database(this.dbName, (err) => {if (err) reject(err) });
			db.get("PRAGMA foreign_keys = ON");
			db.get("PRAGMA busy_timeout = 10000");

            db.run(sql, (err) => {if (err) {
			
				reject(err);} resolve()} )
            db.close();
		})
	}


}

//Taking advantage of nodeJS caching mechanism returning an instance of the class to implement easily the Singleton pattern
module.exports = new PersistentManager();



/*const sqlite = require("sqlite3");

class PersistentManager {
	constructor() {
		this.dbName = "ezwh.db";
		this.db = new sqlite.Database(this.dbName, (err) => {
            if (err)
                throw err;
        });
        this.db.run("PRAGMA foreign_keys = ON");
        this.transaction = { onGoing: false };
	}

	async startTransaction() {
        if (this.transaction.onGoing === true)
            return;

        await this.db.run("BEGIN TRANSACTION");
        this.transaction.onGoing = true;
    }

    async commitTransaction() {
        if (this.transaction.onGoing === false)
            return;

        await this.db.run("COMMIT");
        this.transaction.onGoing = false;
    }

	
    async rollbackTransaction() {
        if (this.transaction.onGoing === false)
            return;

        await this.db.run("ROLLBACK");
        this.transaction.onGoing = false;
    }

	store(tableName, object) {
		return new Promise((resolve, reject) => {
			//names of the attributes of the objects
			let attributesName = [];
			//Values of the attributes
			let attributesValue = [];
			let transaction = this.transaction;
			//Loop through all the object attributes and push them into the arrays
			for (var prop in object) {
				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					attributesName.push(prop);
					attributesValue.push(object[prop]);
				}
			}

			const placeHoldersArray = attributesName.map((val) => "?");
			const sql =
				"INSERT INTO " +
				tableName +
				"(" +
				attributesName.join(",") +
				") VALUES (" +
				placeHoldersArray.join(",") +
				")";
			//const sql = "INSERT INTO " + tableName + " VALUES (?,?)"

			const db = this.db;
			db.run(sql, attributesValue, function(err) {
				if (err) {
					if (transaction.onGoing) {
                        db.run("ROLLBACK");
                        transaction.onGoing = false;
                    }
					reject(err);
					
					return;
				}
				resolve(this.lastID);
			});
		});
	}

	loadAllRows(tableName) {
		return new Promise((resolve, reject) => {
			const sql = "SELECT * FROM " + tableName;
			const db = this.db;
			let transaction = this.transaction;
			db.all(sql, (err, rows) => {
				if (err) {
					if (transaction.onGoing) {
                        db.run("ROLLBACK");
                        transaction.onGoing = false;
                    }
					reject(err);
					
					return;
				}
				resolve(rows);
			});
		});
	}

	async loadAllRowsSelected(tableName, selectedAttributes) {
		return new Promise((resolve, reject) => {
			const selected = selectedAttributes.join(',');
			const sql = "SELECT " + selected + " FROM " + tableName;
			const db = this.db;
			let transaction = this.transaction;
            db.run(sql, (err,rows) => {if (err) reject(err); resolve(rows); } )
            
		})
	}

    async delete(attribute_name ,id, tableName) {
        return new Promise ((resolve, reject) => {
            const sql = "DELETE FROM " + tableName + " WHERE "+ attribute_name + "= ?";
            const db = this.db;
			let transaction = this.transaction;
            db.run(sql, id, (err) => {if (err){
				if (transaction.onGoing) {
					db.run("ROLLBACK");
					transaction.onGoing = false;
				}
				reject(err)
			}  resolve(); } )
            
        })
    }

    async loadOneByAttribute(parameter_name, tableName, value ){
        return new Promise ((resolve, reject) => {
			
            const sql = "SELECT * FROM " + tableName + " WHERE " + parameter_name + " = ?";
			
            const db = this.db;
			let transaction = this.transaction;
			
            db.get(sql, value, (err, row) => {if (err){
				if (transaction.onGoing) {
					db.run("ROLLBACK");
					transaction.onGoing = false;
				}
				reject(err);
			}
			resolve(row); } )
            
        })
    }


    async update(tableName, object, attribute_name, id) {
        return new Promise ((resolve, reject) => {
            //names of the attributes of the objects
			let attributesName = [];
			//Values of the attributes
			let attributesValue = [];
			let transaction = this.transaction;
			//Loop through all the object attributes and push them into the arrays
			for (var prop in object) {
				if (Object.prototype.hasOwnProperty.call(object, prop)) {
					attributesName.push(prop + "= ?");
					attributesValue.push(object[prop]);
				}
			}


            const sql = "UPDATE " + tableName +
                        " SET " + attributesName.join(",") + 
                        " WHERE " + attribute_name + " = ?";

            const db = this.db;
            db.run(sql, [...attributesValue, id], (err) => {
                if (err) {
					if (transaction.onGoing) {
						db.run("ROLLBACK");
						transaction.onGoing = false;
					}
					reject(err) }
                resolve();
            });

            
        }) 
    }


    async loadFilterByAttribute(tableName, parameterName, value) {
        return new Promise ((resolve, reject) => {
            const sql = "SELECT * FROM " + tableName + " WHERE " + parameterName + "= ?";
            const db = this.db;
			let transaction = this.transaction;
            db.all(sql, value, (err,rows) => {if (err) {
				if (transaction.onGoing) {
					db.run("ROLLBACK");
					transaction.onGoing = false;
				}
				reject(err);} resolve(rows); } )
            
        })
    }

	async loadByMoreAttributes(tableName, parametersName, values) {
		return new Promise ((resolve, reject) => {
			const placeHolders = parametersName.map( v => {
				return v + " = ?"
			})
			const sql = "SELECT * FROM " + tableName + " WHERE " + placeHolders.join(' AND ');
			const db = this.db;
			let transaction = this.transaction;
			db.all(sql, values, (err,rows) => {if (err) {
				if (transaction.onGoing) {
					db.run("ROLLBACK");
					transaction.onGoing = false;
				}
				reject(err);} resolve(rows); } );
			
		})
	}

	//never used 
	// async loadOneByAttributeSelected(tableName, parameter_name, value, selectedNames) {
	// 	return new Promise ((resolve, reject) => {
	// 		const selectedAttributes = selectedNames.join(',');
	// 		const sql = "SELECT " + selectedAttributes + " FROM " + tableName + " WHERE " + parameter_name + "= ?";
    //         const db = this.db;
	// 		let transaction = this.transaction;
    //         db.get(sql, value, (err, row) => {if (err) {
	// 			if (transaction.onGoing) {
	// 				db.run("ROLLBACK");
	// 				transaction.onGoing = false;
	// 			}
	// 			reject(err);} resolve(row); } )
            
	// 	})
	// }

	async exists(tableName, parameter_name, value) {
		try {
			let row = await this.loadOneByAttribute(parameter_name, tableName, value);
			if (row) {
				return true;
			}
			else {
				return false;
			}
		}
		catch (err) {
			return Promise.reject(err);
		}
	}

	async deleteAll(tableName) {
		return new Promise ((resolve, reject) => {
			const sql = "DELETE FROM " + tableName;
            const db = this.db;
            db.run(sql, (err) => {if (err) {
			
				reject(err);} resolve()} )
            
		})
	}
}
*/
//Taking advantage of nodeJS caching mechanism returning an instance of the class to implement easily the Singleton pattern
//module.exports = new PersistentManager();

