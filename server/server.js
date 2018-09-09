const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

const {generateMessage} = require("./utils/message");

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

    // Welcome new user joining chat
    socket.emit("newMessage", generateMessage("Admin", "Welcome to the chat app"));
    socket.broadcast.emit("newMessage", generateMessage("Admin", "New user joined"));

    // socket.emit will emit message to single connection
    socket.on("createMessage", (message, callback) => {
        console.log("create message", message);

        // io.emit will send message to all connections
        io.emit("newMessage", generateMessage(message.from, message.text));
        callback("This is from the server");

        // will emit message to everyone but current connection
        // socket.broadcast.emit("newMessage", {
        //     from: message.from,
        //     text: message.text,
        //     createdAt: new Date().getTime()
        // });
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

// server listen
server.listen(PORT, () => {
    console.log("Listening on port", PORT);
});