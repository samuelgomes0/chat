import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

const onlineUsers = new Map();

io.on('connection', (socket) => {
  socket.on('join', (username) => {
    socket.data = {
      id: socket.id,
      username,
    };

    onlineUsers.set(socket.id, socket.data);

    io.emit('online users', [...onlineUsers.values()]);
    socket.emit('user joined', socket.data);

    console.log(`${socket.data.username} joined the chat`);
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);

    console.log(`${socket.data.username} left the chat`);
  });

  socket.on('message', (text) => {
    const time = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    io.emit('receive message', {
      userId: socket.id,
      username: socket.data.username,
      text,
      time,
    });

    console.log(`${socket.data.username}: ${text}`);
  });

  socket.on('change username', (username) => {
    console.log(`${socket.data.username} changed username to ${username}`);

    socket.data.username = username;

    io.emit('online users', [...onlineUsers.values()]);

    socket.emit('user joined', socket.data);
  });

  socket.on('user typing', (isTyping) => {
    if (isTyping) {
      socket.broadcast.emit('user typing', {
        userId: socket.id,
        username: socket.data.username,
      });
    } else {
      socket.broadcast.emit('user typing', false);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
