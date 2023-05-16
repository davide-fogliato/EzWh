const User = require('../model/User');
const PersistentManager = require('../DB/PersistentManager');
const bcrypt = require('bcrypt');

class UserManager {
    constructor(){}

    async getAllSuppliers() {
        return PersistentManager.loadFilterByAttribute(User.tableName, 'type', 'supplier');

    }

    async getAllUsers() {
        
        const users = await PersistentManager.loadAllRows(User.tableName);
        const usersAPI = users.filter((u) => u.type != "manager" ).map((u) => ({
            id: u.id,
            name: u.name,
            surname: u.surname,
            email: u.username,
            type: u.type,
        }));
        return usersAPI;
    }

    async defineUser(name, surname, password, username, type) {
        try {
        const existsUser = await PersistentManager.loadByMoreAttributes(User.tableName, ['username', 'type'], [username, type]);
        if(existsUser.length != 0) {
            return Promise.reject("409 email type");
        }
        const pwd = await bcrypt.hash(password, 12);
        const user = new User(username, pwd, name, surname, type);
        return PersistentManager.store(User.tableName, user);
        }
        catch (err) {
            return Promise.reject("503")
        }

    }

    async login(username, password, type) {
        try {
        
        const user = await PersistentManager.loadByMoreAttributes(User.tableName, ['username', 'type'], [username, type]);
        //The user exists
        if (user.length != 0) {
            const u = user[0];
            const hash = u.password;

            const isPassRight = await bcrypt.compare(password, hash);

              if(!isPassRight) {
                  return Promise.reject("wrong password");
              }

            
            return {id: u.id, username: u.username, name: u.name};
        }
        else {
            return Promise.reject("user not found");
        }
        }
        catch (err) {
            return Promise.reject("500")
        }

    }

    async logout() {
        return true;
    }

    async modifyUser(username, oldType, newType) {

        const user = await PersistentManager.loadByMoreAttributes(User.tableName, ['username', 'type'], [username, oldType]);
        
        if (user.length === 0){
            
            return Promise.reject("404")
        }
        const u = user[0];
        const id = u.id;
        const toModify = {
            type: newType
        }
        return PersistentManager.update(User.tableName, toModify, 'id', id);

    }

    async deleteUser(username, type) {
        const user = await PersistentManager.loadByMoreAttributes(User.tableName, ['username', 'type'], [username, type]);
        const u = user[0];
        let id;
        if (u) {
            id = u.id;
        }
        else {
            id = null;
        }
        return PersistentManager.delete('id', id, User.tableName);
    }

}

module.exports = new UserManager();