let socket = io();
let locationButton = document.getElementById("send-location");

// will take in mustache template and render a document fragment which will be appended
// to the message ordered list element
function appendNewMessage(html){
    let range = document.createRange();
    let documentFragment = range.createContextualFragment(html);
    document.getElementById("messages").appendChild(documentFragment);
}

socket.on("connect", () => {
   console.log("Connected to server"); 
});

socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

socket.on("newMessage", (message) => {
    // set timestamp
    let formattedTime = moment(message.createdAt).format("h:mm a");

    // create a template HTML string
    let template = document.getElementById("message-template").innerHTML;
    let html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    appendNewMessage(html);
});


socket.on("newLocationMessage", (message) => {
    // set timestamp
    let formattedTime = moment(message.createdAt).format("h:mm a");

    // create a template HTML string
    let template = document.getElementById("location-message-template").innerHTML;
    let html = Mustache.render(template, {
        url: message.url,
        from: message.from,
        createdAt: formattedTime
    });

    appendNewMessage(html);
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