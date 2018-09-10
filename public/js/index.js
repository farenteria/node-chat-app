let socket = io();
let locationButton = document.getElementById("send-location");

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


socket.on("newLocationMessage", (message) => {
    // create a new <li> element with appropriate content
    let ol = document.getElementById("messages");
    let li = document.createElement("li");
    let a = document.createElement("a");

    let content = document.createTextNode('My current location');
    a.appendChild(content);
    a.setAttribute("target", "_blank");
    a.setAttribute("href", message.url);

    content = document.createTextNode(`${message.from}: `);
    li.appendChild(content);
    li.appendChild(a);

    // append created li element to ol
    ol.appendChild(li);
});

// This will handle each user message 
document.querySelector("#message-form button").addEventListener("click", (e) => {
    e.preventDefault();
    let messageTextbox = document.querySelector("[name=message]");

    socket.emit("createMessage", {
        from: "User",
        text: messageTextbox.value
    }, function(){
        messageTextbox.value = "";
    });
});

locationButton.addEventListener("click", () => {
    if(!navigator.geolocation){
        return alert("Geolocation not supported by your browser");
    }

    // don't allow user to spam location button while browser is getting location
    locationButton.setAttribute("disabled", "disabled");
    locationButton.textContent = "Sending location...";

    // (success, failure)
    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttribute("disabled");
        locationButton.textContent = "Send location";

        socket.emit("createLocationMessage", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
    }, () => {
        locationButton.removeAttribute("disabled");
        locationButton.textContent = "Send location";

        alert("Unable to fetch location");
    });
});