const chai = require('chai');
const chaiHttp = require('chai-http');
const PersistentManager = require('../bin/DB/PersistentManager');
chai.use(chaiHttp);
chai.should();

const app = require('../server');
var agent = chai.request.agent(app);


describe('test scenarios 4-1 4-2 4-3 ', () => {

    before(async () => {
        await PersistentManager.deleteAll("User");
    })

    newUser(201, 'mmz@m1mz.com', 'Maurizio', "Morisio", "testpassword", "supplier");
    newUser(422);
    newUser(422, 'mmz@m1mz.com', 'Maurizio', "Morisio", "testpassword", "notExistingType");
    newUser(409, 'mmz@m1mz.com', 'Maurizio', "Morisio", "testpassword", "supplier");
    modifyUser(404, 'notexisting@not.com', 'supplier', 'qualityEmployee');
    modifyUser(422, 'mmz@m1mz.com', 'supplier', 'not existing');
    modifyUser(200, 'mmz@m1mz.com', 'supplier', 'qualityEmployee');
    deleteUser(204, 'mmz@m1mz.com', "qualityEmployee");
    deleteUser(422, 'mmz@m1mz.com', "notExistingType");
    deleteUser(422, 'mmz@m1mz.com', "manager");

});



/*
    "username":"user1@ezwh.com",
    "name":"John",
    "surname" : "Smith",
    "password" : "testpassword",
    "type" : "supplier"
*/

//Scenario 4-1
function newUser(expectedHTTPStatus, username, name, surname, password, type) {
    it('adding a new user', function (done) {
        let user = { username: username, name: name, surname: surname, password: password, type: type }
        agent.post('/api/newUser')
            .send(user)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}

//Scenario 4-2
function modifyUser(expectedHTTPStatus, username, oldType, newType) {
    it('modifying a user', function (done) {
        let types = { oldType: oldType, newType: newType}
        agent.put(`/api/users/${username}`)
            .send(types)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}


//Scenario 4-3
function deleteUser(expectedHTTPStatus, username, type) {
    it('deleting user', function (done) {
        agent.delete(`/api/users/${username}/${type}`)
            .then(function (res) {
                res.should.have.status(expectedHTTPStatus);
                done();
            });
    });
}
/*
function getUser(expectedHTTPStatus, username, name, surname, role) {
    it('getting user data from the system', function (done) {
        let user = { username: username, name: name, surname: surname, role: role }
        agent.post('/users/newUser/')
            .send(user)
            .then(function (res) {
                res.should.have.status(201);
                res.body.username.should.equal(username);
                agent.get('/users/getUser/' + username)
                    .then(function (r) {
                        r.should.have.status(expectedHTTPStatus);
                        r.body.id.should.equal(username);
                        r.body.fullName.should.equal(name + ' ' + surname);
                        r.body.role.should.equal(role);
                        done();
                    });
            });
    });
}*/
