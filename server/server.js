const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.port || 3000;
const publicPath = path.join(__dirname, "../public");

// server setup
app.use(express.static(publicPath));

// server listen
app.listen(PORT, () => {
    console.log("Listening on port", PORT);
});