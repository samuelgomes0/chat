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

io.on("connection", (socket) => {
  let users = [];

  socket.on("join", (username) => {
    console.log(`${username} joined`);

    socket.username = username;

    users.push(username);

    socket.broadcast.emit("insert user", {
      username: socket.username,
      users,
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);

    users = users.filter((user) => user !== socket.username);

    socket.broadcast.emit("remove user", {
      username: socket.username,
      users,
    });
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

    console.log(`${oldUsername} changed username to ${username}`);

    socket.username = username;

    io.emit("warn change username", {
      oldUsername,
      username,
    });
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
