let socket = io();
let locationButton = document.getElementById("send-location");

// will take in mustache template and render a document fragment which will be appended
// to the message ordered list element
function appendNewMessage(html){
    let range = document.createRange();
    let documentFragment = range.createContextualFragment(html);
    document.getElementById("messages").appendChild(documentFragment);
}


// Scroll to the bottom if user is eat or near the end
// Do not scroll page if user has scrolled up to read prior messages
function scrollToBottom(){
    let messages = document.getElementById("messages");
    let newMessage = messages.lastElementChild;

    let clientHeight = parseInt(messages.clientHeight);
    let scrollTop = parseInt(messages.scrollTop);
    let scrollHeight = parseInt(messages.scrollHeight);
    let newMessageHeight = parseInt(newMessage.offsetHeight);
    let lastMessageHeight = parseInt(messages.lastChild.previousElementSibling.offsetHeight);

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop = scrollHeight;
    }
}

// get contents of window.location.search and remove all non-alphabetical characterers
function deparam(uri){
    if(uri == undefined){
        uri.window.location.search;
    }

    let queryString = {};

    uri.replace(
        new RegExp(
            "([^?=&]+)(=([^&#]*))?", "g"),
            function($0, $1, $2, $3) {
                queryString[$1] = decodeURIComponent($3.replace(/\+/g, '%20'));
            }
    );

    return queryString;
}

// Run when joining a room
socket.on("connect", () => {
    let params = deparam(window.location.search);

    socket.emit("join", params, (err) => {
        if(err){
            alert(err);
            window.location.href = "/";
        }else{
            console.log("No error");
        }
    });
});

// We will update the user list anytime server tells us that a user has connected or
// disconnected from current user's room
socket.on("updateUserList", (users) => {
    // Even though document.getElementById should sanitize innerHtml, textContent is a safer alternative
    let ol = document.getElementById("users");
    ol.textContent = "";

    // add each user in the current room as a list item
    users.forEach(user => {
        let li = document.createElement("li");
        let content = document.createTextNode(user);
        li.appendChild(content);
        ol.appendChild(li);
    });
});


socket.on("disconnect", () => {
    console.log("Disconnected from server");
});

// Whenever the server sends a new message, add to DOM along with name of user and timestamp
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
    scrollToBottom();
});

// Get a Google Maps link from users that click Send Location button
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
    scrollToBottom();
});

// This will handle each user message 
document.querySelector("#message-form button").addEventListener("click", (e) => {
    e.preventDefault();
    let messageTextbox = document.querySelector("[name=message]");

    socket.emit("createMessage", {
        text: messageTextbox.value
    }, function(){
        messageTextbox.value = "";
    });
});

// Send Location Button handler
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
        // Fail state
        locationButton.removeAttribute("disabled");
        locationButton.textContent = "Send location";

        alert("Unable to fetch location");
    });
});