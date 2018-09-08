let socket = io();

socket.on("connect", () => {
   console.log("Connected to server"); 

   socket.emit("createMessage", {
        from: "someEmail@gmail.com",
        text: "sdfgd",
   });
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("newMessage", (message) => {
    console.log("New message", message);
});