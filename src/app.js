import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server);

const __dirname = path.resolve();

app.use(express.static(__dirname + "/public/"));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat message", (message) => {
    console.log(`Message: ${message}`);
    io.emit("chat message", message);
  });
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
