const expect = require("expect");

const {Users} = require("./users");

describe("Users", () => {
    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: "1",
            name: "Fernan",
            room: "The Office Fans"
        },{
            id: "2",
            name: "Pepe",
            room: "Veronica Mars"
        },{
            id: "3",
            name: "Steve",
            room: "The Office Fans"
        }];
    });

    it("should add a new user", () => {
        let users = new Users();
        let user = {
            id: "123",
            name: "Fernando",
            room: "The Office Fans"
        };

        let resUsers = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);;
    });

    it("should return names for The Office Fans", () => {
        let userList = users.getUserList("The Office Fans");
        expect(userList).toEqual(["Fernan", "Steve"]);
    });

    it("should return names for Veronic Mars", () => {
        let userList = users.getUserList("Veronica Mars");
        expect(userList).toEqual(["Pepe"]);
    });

    it("should remove a user", () => {
        let user = users.removeUser("2");
        expect(users.users.length).toEqual(2);
    });

    it("should not remove a user", () => {
        let user = users.removeUser("4");
        expect(users.users.length).toEqual(3);
    });

    it("should find user", () => {
        let userId = "3";
        let user = users.getUser(userId);
        expect(user.id).toEqual(userId);
    });

    it("should not find user", () => {
        let userId = "4";
        let user = users.getUser(userId);
        expect(user).toNotExist();
    });
});