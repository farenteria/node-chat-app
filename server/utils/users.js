class Users{
    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }

    removeUser(id){
        let removedUser = this.getUser(id);
        
        if(removedUser){
            this.users = this.users.filter((user) => user.id !== id);
        }

        return removedUser;
    }

    getUser(id){
        let user = this.users.find((user) => user.id === id);
        return user;
    }

    getUserList(room){
        let users = this.users.filter((user) => user.room === room);
        let nameArray = users.map((user) => user.name);

        return nameArray;
    }
}

module.exports = {Users};