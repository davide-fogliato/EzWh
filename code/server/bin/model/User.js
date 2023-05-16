'use strict'

class User {
    static tableName = 'User';
    constructor (username, password,name, surname, type ){
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.type = type;
    }
}

module.exports = User;