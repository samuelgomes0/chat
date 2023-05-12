import express from "express";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();
const server = createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "/public")));

const userList = new Map();

io.on("connection", (socket) => {
  socket.on("join", (username) => {
    socket.username = username;

    userList.set(username, socket.id);

    socket.broadcast.emit("insert user", {
      username: socket.username,
      users: userList,
    });

    console.log(`${username} joined`);
  });

  socket.on("disconnect", () => {
    userList.delete(socket.username);

    socket.broadcast.emit("remove user", {
      username: socket.username,
      users: userList,
    });

    console.log(`${socket.username} disconnected`);
  });

  socket.on("message", (message) => {
    const time = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    io.emit("message", {
      message,
      time,
      username: socket.username,
    });
  });

  socket.on("change username", (username) => {
    const oldUsername = socket.username;

    socket.username = username;

    io.emit("warn change username", {
      oldUsername,
      username,
    });
    console.log(`${oldUsername} changed username to ${username}`);
  });

  socket.on("user is typing", () => {
    socket.broadcast.emit("user is typing", {
      username: socket.username,
    });
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
