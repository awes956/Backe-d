const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 9999;
const FILE_PATH = "textData.txt";

let textData = fs.existsSync(FILE_PATH) ? fs.readFileSync(FILE_PATH, "utf8") : "";

app.use(cors());

io.on("connection", (socket) => {
    console.log("New client connected");
    socket.emit("loadText", textData);

    socket.on("textUpdate", (newText) => {
        textData = newText;
        fs.writeFileSync(FILE_PATH, textData);
        socket.broadcast.emit("updateText", newText);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
