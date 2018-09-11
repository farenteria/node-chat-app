const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");
const {Users} = require("./utils/users");

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
let server = http.createServer(app);
let io = socketIO(server);
let users = new Users();

// server setup
app.use(express.static(publicPath));

// Server connections
// on() registers events, and "connection" listens for new connections
io.on("connection", (socket) => {
    console.log("new connection");

    socket.on("join", (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            // returning will ensure that code doesn't continue onto below code
            return callback("Name and room are required ");
        }

        // add user to specific room and ensure that messages are sent to that room
        socket.join(params.room);
        users.removeUser(socket.id); // remove user from previous room before adding to new room 
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit("updateUserList", users.getUserList(params.room));
        socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", ` ${params.name} has joined`));

        callback();
    });

    // socket.emit will emit message to single connection
    socket.on("createMessage", (message, callback) => {
        // socket.id will get id of client who's emiting createMessage
        let user = users.getUser(socket.id);

        // don't let users send empty messages
        if(user && isRealString(message.text)){
            // io.emit will send message to all connections
            io.to(user.room).emit("newMessage", generateMessage(user.name, message.text));
        }

        callback();
    });

    // this will fire when user clicks the send location button
    socket.on("createLocationMessage", (coords) => {
        let user = users.getUser(socket.id);

        // ensure that we only send location to room user is in
        if(user){
            io
                .to(user.room)
                .emit("newLocationMessage", generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });

    // make sure to remove users when they leave the room
    socket.on("disconnect", () => {
        let user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit("updateUserList", users.getUserList(user.room));
            io.to(user.room).emit("newMessage", generateMessage("admin", `${user.name} has left`));
        }
    });
});

// server listen
server.listen(PORT, () => {
    console.log("Listening on port", PORT);
});