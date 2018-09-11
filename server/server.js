const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const {generateMessage, generateLocationMessage} = require("./utils/message");
const {isRealString} = require("./utils/validation");

const app = express();
const PORT = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
let server = http.createServer(app);
let io = socketIO(server);

// server setup
app.use(express.static(publicPath));

// Server connections
// on() registers events, and "connection" listens for new connections
io.on("connection", (socket) => {
    console.log("new connection");

    socket.on("join", (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback("Name and room are required ");
        }

        // add user to specific room and ensure that messages are sent to that room
        socket.join(params.room);

        socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));
        socket.broadcast.to(params.room).emit("newMessage", generateMessage("Admin", ` ${params.name} has joined`));

        callback();
    });

    // socket.emit will emit message to single connection
    socket.on("createMessage", (message, callback) => {
        console.log("create message", message);

        // io.emit will send message to all connections
        io.emit("newMessage", generateMessage(message.from, message.text));
        callback();
    });

    socket.on("createLocationMessage", (coords) => {
        io.emit("newLocationMessage", generateLocationMessage("Admin", coords.latitude, coords.longitude));
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

// server listen
server.listen(PORT, () => {
    console.log("Listening on port", PORT);
});