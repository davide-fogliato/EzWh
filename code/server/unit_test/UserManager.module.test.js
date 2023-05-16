const UserManager = require("../bin/controller/UserManager");
const PersistentManager = require("../bin/DB/PersistentManager");

describe('user tests',  () => {

    const name = "John";
    const surname = "Smith";
    const password = "testpassword";
    const username = "test@test.com";
    const types = ['supplier', 'customer', 'manager']
    userTests();
    function userTests() {
        beforeEach( async () => {
            await PersistentManager.deleteAll("User");
        })

        test('load all users', async () => {
            const userForDB = {
                username: "test@test.com",
                password: "testPassword",
                name: "name",
                surname: "surname",
                type: "customer"
            }
            const userid = await PersistentManager.store("User", userForDB);
            const users = await UserManager.getAllUsers();
            const u = users[0];
            const expected = {...userForDB};
            expected.id = userid;
            delete expected.password;
            expected.email = expected.username;
            delete expected.username;
            expect(u).toEqual(expected);
        })

        test('delete user', async () => {
            const userForDB = {
                username: "test@test.com",
                password: "testPassword",
                name: "name",
                surname: "surname",
                type: "customer"
            }
            const userid = await PersistentManager.store("User", userForDB);
            await UserManager.deleteUser('test@test.com', 'customer');
            const users = await UserManager.getAllUsers();
            expect(users).toEqual([]);
        })

        test('define user',async () => {
            ids = [];
            for (const type of types) {
                if (type == "manager") continue;
                const id = await UserManager.defineUser(name, surname, password, username, type);
                ids.push(id);
            }
            let users = await UserManager.getAllUsers();

            users = new Set(users);
            let expectedUsers = types.filter((t) => t!= "manager").map( (t, i) => {return {
                id: ids[i],
                name: "John",
                surname: "Smith",
                email: "test@test.com",
                type: t
            }});
            expectedUsers = new Set(expectedUsers);

            
            expect(users).toEqual(expectedUsers);
        })

        test('login', async () => {
            let u = await UserManager.defineUser('john', 'smith', 'testpassword', 'test@test.com', 'customer');
            
            //return {id: u.id, username: u.username, name: u.name};
            const expectedUser = {
                id: u,
                username: 'test@test.com',
                name: 'john'
            }

            let res = await UserManager.login('test@test.com', 'testpassword', 'customer');
            expect(res).toEqual(expectedUser);
        })

        test('logout', async () => {
            let res = await UserManager.logout();
            expect(res).toEqual(true);
        })

        test('modify type', async () => {
            let u = await UserManager.defineUser('john', 'smith', 'testpassword', 'test@test.com', 'customer');
            await UserManager.modifyUser('test@test.com', 'customer', 'supplier');
            let userFromDB = await PersistentManager.loadOneByAttribute('id', "User", u);
            expect(userFromDB.type).toEqual('supplier');
        })

        
       

    }
})