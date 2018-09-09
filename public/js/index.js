let socket = io();

socket.on("connect", () => {
   console.log("Connected to server"); 
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("newMessage", (message) => {
    console.log("New message", message);

    // create a new <li> element with appropriate contenct
    let li = document.createElement("li");
    let content = document.createTextNode(`${message.from}: ${message.text}`);
li.appendChild(content);

    // append created li element to ol
    let ol = document.getElementById("messages");
    ol.appendChild(li);
});

// This will handle each user message 
document.querySelector("#message-form button").addEventListener("click", (e) => {
    e.preventDefault();

    socket.emit("createMessage", {
        from: "User",
        text: document.querySelector("[name=message]").value
    }, function(){

    });
});