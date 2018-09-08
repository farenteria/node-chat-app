const path = require("path");
const express = require("express");
const socketIO = require("socket.io");
const http = require("http");

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

    // socket.emit will emit message to single connection
    socket.on("createMessage", (message) => {
        console.log("create message", message);

        // Welcome new user joining chat
        socket.emit("newMessage", {
            from: "Admin",
            text: "Welcome to the chat app!",
            createdAt: new Date().getTime()
        });

        socket.broadcast.emit("newMessage", {
            from: "Admin",
            text: "New user joined",
            createdAt: new Date().getTime()
        });

        // io.emit will send message to all connections
        io.emit("newMessage", {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });

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