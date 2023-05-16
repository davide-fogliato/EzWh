# Unit Testing Report

Date:

Version:

# Contents

- [Black Box Unit Tests](#black-box-unit-tests)




- [White Box Unit Tests](#white-box-unit-tests)


# Black Box Unit Tests

    <Define here criteria, predicates and the combination of predicates for each function of each class.
    Define test cases to cover all equivalence classes and boundary conditions.
    In the table, report the description of the black box test case and (traceability) the correspondence with the Jest test case writing the 
    class and method name that contains the test case>
    <Jest tests  must be in code/server/unit_test  >

 ### **Class *PersistentManager* - method *store(tableName, object)***

PersistentManager.store(tableName, object) saves the object passed as parameters
in the table specified by tableName. the value of the keys of the object must be equal 
to the name of the columns.
The output, if everything goes well, is the last inserted ID.

**Criteria for method *store*:**
	

 - value of tableName
 - number of fields in object
 - value of keys of object


**Predicates for method *store*:**

| Criteria | Predicate |
| -------- | --------- |
|tableName | present in DB |       
|          | not present in DB         |
| number of fields in object         |   equal to the # of columns - 1 (id is not present)       |
|          |   not equal to the # of columns - 1        |
| value of keys of object | same as the database columns |
| | at least one value is different from the database columns|




**Boundaries**:

In this case there is no boundary case.



**Combination of predicates**:


| value of tableName | number of fields in object     | value of keys of object                                   | Valid / Invalid | Description of the test case                              | Jest test case                                         |
|--------------------|--------------------------------|-----------------------------------------------------------|-----------------|-----------------------------------------------------------|--------------------------------------------------------|
| present in DB      | same as the database columns   | same as the database columns                              | V               | PersistentManager.store(tableName, object) -> lastID      | testStoreValid("User", user);                          |
|                    |                                | at least one value is different from the database columns | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("User", wrongKeys);                   |
|                    | not equal to the # of columns  | same as the database columns                              | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("User", wrongNumberOfFields);         |
|                    |                                | at least one value is different from the database columns | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("User", wrongKeysWrongNumber);        |
| not present in DB  | same as the database columns   | same as the database columns                              | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("wrong table", user);                 |
|                    |                                | at least one value is different from the database columns | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("wrong table", wrongKeys);            |
|                    | not equal to the # of columns  | same as the database columns                              | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("wrong table", wrongNumberOfFields);  |
|                    |                                | at least one value is different from the database columns | I               | PersistentManager.store(tableName, object) -> throw Error | testStoreInvalid("wrong table", wrongKeysWrongNumber); |


 ### **Class *PersistentManager* - method *loadAllRows(tableName)***
Loads a list containing all the objects saved in the database


**Criteria for method *store*:**
	

 - value of tableName
 - number of objects present in the table


**Predicates for method *name*:**

| Criteria | Predicate |
| -------- | --------- |
|value of tableName | present in DB |       
|          | not present in DB         |
|   number of objects present in the table     |   > 0     |


**Boundaries**:


| Criteria | Boundary values |
| -------- | --------------- |
|   number of objects present in the table     |   0     |





| value of tableName | number of objects present in the table | Valid / Invalid | Description of the test case                             | Jest test case               |
|--------------------|----------------------------------------|-----------------|----------------------------------------------------------|------------------------------|
| present in DB      | >0                                     | V               | PersistentManager.loadAllRows(tableName) -> List&lt;Object> | testLoadValid("User", 1);    |
|                    | 0                                      | V               | PersistentManager.loadAllRows(tableName) -> Empty list   | testLoadValid("User", 0);    |
| not present in DB  | >0                                     | I               | PersistentManager.loadAllRows(tableName) -> Throw error  | testLoadInvalid("wrong", 1); |
|                    | 0                                      | I               | PersistentManager.loadAllRows(tableName) -> Throw error  | testLoadValid("wrong", 0);   |


### **Class *PersistentManager* -  method : *delete(attribute_name ,id, tableName)***
PersistentManager.delete(attribute_name ,id, tableName) delete the  rows which are found according to request in the certain Table 


**Criteria for method *delete*:**
	

 - The value of TableName
 - The value of Key
 - Number of available rows in a selected Table



**Predicates for method *delete*:**

| Criteria                 | Predicate                     |
| -------------------------| ----------------------------- |
| The value of TableName    | No existing table |
|          |      Existing the table     |
| The value of Key    | Wrong key(attribute) name |
|          |      Correct key name     |
| Available row in table    | No available row in table  |
|          |      Available rows to be deleted in table     |



**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
| Available row in table |       0          |
|          |                 |



**Combination of predicates**:


| The value of TableName |The value of Key|Available row in table | Valid / Invalid | Description of the test case | Jest test case |
|-------|--------|-------|-------|-------|-------|
|Valid TableName| Valid Key|Available row in table|V|T1:delete(attri_name,val,tableName) -> #Row =Tot#-AvailableNumRow|TestDelete(RestockOrder.tableName,RO,2,RO2,3,ValidList,InvalidList);|
|| |InAvailable row in table|V|T2:delete(attri_name,val,tableName) -> return the length of row is same as before|testDeleteValid("State","ISSUED","RestockOrder",NULL)|
|| InValid Key|Available row in table|I|T3:delete(attri_name,val,tableName) -> Throw error|testDeleteFailed("WrongKey","ISSUED","RestockOrder",Invalid Key)|
|| |Inavailable row in table|I|T4:delete(attri_name,val,tableName) -> Throw error|testDeleteFailed("WrongKey","ISSUED","RestockOrder",InvalidKeyRow)|
|Invalid TableName|Valid Key|Available row in table|I|T5:delete(attri_name,val,tableName) -> Throw error|testDeleteFailed("State","ISSUED","WrongTable",Invalid TableName)|
|||InAvailable row in table|I|T6:delete(attri_name,val,tableName) -> Throw error|testDeleteFailed("State","ISSUED","WrongOrder",Invalid TableRow)|
||InValid Key|Available row in table|I|T7:delete(attri_name,val,tableName) -> Throw error|testDeleteFailed("WrongKey","ISSUED","WrongOrder",Invalid TableKey)|
|||Invailable row in table|I|T8:delete(attri_name,val,tableName) -> Throw error|testDeleteFailed("State","ISSUED","WrongOrder",InvalidTableRow)|


### **Class *PersistentManager* - method : *update(tableName, object, attribute_name, id)***

**Criteria for method *update(tableName, object, attribute_name, id)*:**

 - The value of tableName
 - The value of attributeName(key)
 - The value of object
 - The validation of id(value)
 - Number of available rows in a selected Table

**Predicates for method *update*:**

| Criteria                 | Predicate                     |
| -------------------------| ----------------------------- |
| The value of tableName    | No existing table |
|          |      Existing the table     |
| The value of attributeName(key)    | Wrong key(attribute) name |
|          |      Correct key name     |
| Available row in table    | No available row in table  |
|          |      Available rows to be deleted in table     |
| The value of keyPart of object    | wrong key of object |
|          |      correct KeyPart   |
| The value of ValuePart of object    | wrong value of object |
|          |      correct ValuePart   |
| The validation of id(value) | not existing id in WH |
|          |      existing id in WH   |





**Boundaries**:

| Criteria | Boundary values |
| -------- | --------------- |
| Available row in table | 0 |
|          |                 |



**Combination of predicates**:
| The value of TableName |The value of Key|Available row in table | Key value of object| Value part of object |The type of value | Valid / Invalid | Description of the test case | Jest test case |
|-------|--------|-------|-------|-------|-------|-------|-------|-------|
|Valid TableName| Valid Key|Available row in table| correct key part of object| correct value part object|correct type of value |V|T1 update(tableName, object, attribute_name, id) -> update successfully|TestValidUpdate(RestockOrder.tableName,RO,2,RO2,3,T1)|
|               |                                                                                  || ||incorrect type of value |I|T2update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |                                                         || |incorrect value part object|correct type of value |I|T3 update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |                                                       || |                           |incorrect type of value |I|T4 update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |          |                      |incorrect key part of object |correct value part object|correct type of value |I|T5 update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |                                                                                  || ||incorrect type of value |I|T6 update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |                                                         || |incorrect value part object|correct type of value |I|T7  update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |                                                       || |                           |incorrect type of value |I|T8  update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |           |Inavailable row in table|correct key part of object| correct value part object|correct type of value |V|T9 update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|              | InvalidKey|Available row in table| correct key part of object| correct value part object|correct type of value |V|T10  update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |                                                                                  || ||incorrect type of value |I|T11  update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |                                                         || |incorrect value part object|correct type of value |I|T12  update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |          |                      |incorrect key part of object |correct value part object|correct type of value |I|T13 update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |                                                                                  || ||incorrect type of value |I|T14  update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |                                                         || |incorrect value part object|correct type of value |I|T15  update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|               |                                                       || |                           |incorrect type of value |I|T16  update(tableName, object, attribute_name, id) -> throw Error|TestInvalidUpdate(RestockOrder.tableName,RO,2,RO2,3,T2,InvalidUpdateList);|
|Invalid TableName      |      ...                                     |||                            ||I|T17 throw Error|||





# White Box Unit Tests

### Test cases definition
    
| Unit name | Jest test case |
|--|--|
|PersistentManager.js|PersistentManager.module.test.js|
|PersistentManager.js|testExists.module.test.js|
|Position.js|testIsIdValid.module.test.js||

### Code coverage report

    <Add here the screenshot report of the statement and branch coverage obtained using
    the coverage tool. >

![coverage_report](./Images/apitestreport/coverage_report.png)


### Loop coverage analysis

Analyzing the files of our project, we observed that no significant loops are present. However, according to the code coverage report, we tried to test some specific methods with different 'if' statements to increase the branch coverage percentage, including the tests performed for the PersistentManager.js file.


