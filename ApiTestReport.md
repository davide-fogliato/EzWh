# Integration and API Test Report

Date: 2022-06-21
 
Version: 0.2

# Contents

- [Dependency graph](#dependency graph)

- [Integration approach](#integration)

- [Tests](#tests)

- [Scenarios](#scenarios)

- [Coverage of scenarios and FR](#scenario-coverage)
- [Coverage of non-functional requirements](#nfr-coverage)



# Dependency graph 

In the dependency graph we grouped the model classes in one block to avoid confusion.

![high_level](./Images//apitestreport/dependencyGraph.png)

     
# Integration approach

    The sequence we followed to test is bottom up. In fact we firstly tested the PersistentManager methods as unit tests.
    Then we tested the Manager classes using the already tested PersistentManager methods.
    Then we procedeed to test the APIs.
    For the API testing we tested every scenario in the official requirements.
    


#  Integration Tests

## Step 1
| Classes  | mock up used |Jest test cases |
|--|--|--|
|PersistentManager| | PersistentManager.module.test.js |

## Step 2
| Classes  | mock up used |Jest test cases |
|--|--|--|
| SKUManager | | SKUManager.module.test.js|
| SKUItemManager | | SKUItemManager.module.test.js |
| PositionManager || PositionManager.module.test.js|
| UserManager || UserManager.module.test.js|
| RestockOrderManager | | RestockOrderManager.module.test.js |
| ReturnOrderManager |  |ReturnOrderManager.module.test.js| 
| InternalOrderManager | | InternalOrderManager.module.test.js |
| ItemManager | | ItemManager.module.test.js | 
| QualityTestManager | | QualityTestManager.module.test.js |

## Step 3
| API mocha tests| 
| --- |
| testUC1.js |
| testUC2.js |
| testUC3.js |
| testUC4.js |
| testUC5.js |
| testUC6.js |
| testUC7.js |
| testUC9.js |
| testUC10.js |
| testUC11.js |
| testUC12.js |




# API testing - Scenarios

# Coverage of Scenarios and FR



| Scenario ID | Functional Requirements covered | Mocha  Test(s) | 
| ----------- | ------------------------------- | ----------- | 
| 1-1         | FR2                             |  adding a new SKU     |             
| 1-2         | FR2                             |   modifying sku position          |             
| 1-3         |  FR2                               |    modifying sku weight and volume        |             
| 2-1         |    FR3                             |    adding a new Position         |             
| 2-2         |    FR3                             |      modifying a Position ID      |             
| 2-3         |     FR3                            |        modifying weight and volume    |           
| 2-4         |    FR3                             |      modifying aisle,row,col      |  
| 2-5         |    FR3                             |          delete position   |    
| 3-2         |   FR5                              |       addingRO2      | 
| 4-1         |   FR1                              |       adding a new user      | 
| 4-2         |     FR1                            |      modifying a user       | 
| 4-3         |   FR1                              |      deleting user      | 
| 5-1-1        |        FR5                         | updating Delivered state / updating Delivered state invalid | 
| 5-2-1        |           FR5                     | updating Delivered state to tested / updating Delivered state to tested invalid |
| 5-2-1        |           FR5                      | updating Delivered state to tested / updating Delivered state to tested invalid |
| 5-2-2        |            FR5                   | updating Delivered state to tested / updating Delivered state to tested invalid |
| 5-2-3        |            FR5                     | updating Delivered state to tested / updating Delivered state to tested invalid |
| 5-3-1         |   FR5                              |      stock skuItems      | 
| 5-3-2 | FR5 |  stock skuItems |
| 5-3-3 | FR5 | stock skuItems |
| 6-1        |   FR5                              |      new Return Order      | 
| 6-2       |   FR5                              |      new Return Order      | 
| 7-1       |   FR1                              |      test manager Login      | 
| 7-2      |   FR1                              |      test manager Logout      | 
| 9-1     |   FR6                              |      modifyIOState    | 
| 9-2     |   FR6                              |      modifyIOState    | 
| 9-3     |   FR6                              |      modifyIOState    | 
| 10-1     |   FR5.12                              |      modifyState    | 
| 11-1 | FR7 | adding a new Item |
| 11-2 |  FR7 | modifying Item by Id |
| 12-1 | FR3 | adding a new Test Descriptor|
| 12-2 | FR3 | modifying Test Descriptor by Id |
| 12-3 |FR3  | delete Test Descriptor |
 



# Coverage of Non Functional Requirements




| Non Functional Requirement | Test name |
| -------------------------- | --------- |
|             NFR2               |     All      |
| NFR3 | adding a new user |
| NFR4 | adding a new position|
|  NFR6  |  stock skuItems  | 


