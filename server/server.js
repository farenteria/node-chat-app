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

    socket.emit("newMessage", {
        from: "example@gmail.com",
        text: "Look at some text",
        createAt: 123
    });

    socket.on("createMessage", (message) => {
        console.log("create message", message);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
});

// server listen
server.listen(PORT, () => {
    console.log("Listening on port", PORT);
});