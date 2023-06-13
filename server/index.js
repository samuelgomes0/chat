// Importando as dependências necessárias
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';

// Obtendo o diretório raiz do projeto
const __dirname = path.resolve();

// Criando uma instância do aplicativo express
const app = express();

// Criando um servidor HTTP utilizando o aplicativo express
const server = createServer(app);

// Definindo a porta na qual o servidor irá escutar
const PORT = process.env.PORT || 3000;

// Configurando o aplicativo express para utilizar o diretório 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Criando uma instância do Socket.IO e configurando as opções
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Criando um mapa para armazenar os usuários online
const onlineUsers = new Map();

// Evento disparado quando uma conexão é estabelecida
io.on('connection', (socket) => {
  // Evento disparado quando um usuário se junta ao chat
  socket.on('join', (username) => {
    // Armazenando as informações do usuário no objeto 'socket.data'
    socket.data = {
      id: socket.id,
      username,
    };

    // Adicionando o usuário ao mapa de usuários online
    onlineUsers.set(socket.id, socket.data);

    // Enviando a lista de usuários online para todos os clientes
    io.emit('online users', [...onlineUsers.values()]);

    // Enviando a informação do usuário que se juntou para o próprio usuário
    socket.emit('user joined', socket.data);

    // Exibindo no console a mensagem de que um usuário se juntou ao chat
    console.log(`${socket.data.username} joined the chat`);
  });

  // Evento disparado quando um usuário se desconecta
  socket.on('disconnect', () => {
    // Removendo o usuário do mapa de usuários online
    onlineUsers.delete(socket.id);

    // Exibindo no console a mensagem de que um usuário deixou o chat
    console.log(`${socket.data.username} left the chat`);
  });

  // Evento disparado quando uma mensagem é enviada
  socket.on('message', (text) => {
    // Obtendo o horário atual formatado
    const time = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Enviando a mensagem para todos os clientes conectados
    io.emit('receive message', {
      userId: socket.id,
      username: socket.data.username,
      text,
      time,
    });

    // Exibindo no console a mensagem enviada pelo usuário
    console.log(`${socket.data.username}: ${text}`);
  });

  // Evento disparado quando um usuário altera seu nome de usuário
  socket.on('change username', (username) => {
    // Exibindo no console a mensagem de que um usuário alterou seu nome de usuário
    console.log(`${socket.data.username} changed username to ${username}`);

    // Atualizando o nome de usuário no objeto 'socket.data'
    socket.data.username = username;

    // Enviando a lista de usuários online para todos os clientes
    io.emit('online users', [...onlineUsers.values()]);

    // Enviando a informação do usuário que se juntou para o próprio usuário
    socket.emit('user joined', socket.data);
  });

  // Evento disparado quando um usuário começa ou para de digitar
  socket.on('user typing', (isTyping) => {
    if (isTyping) {
      // Enviando uma mensagem indicando que um usuário está digitando para todos os clientes, exceto o próprio usuário
      socket.broadcast.emit('user typing', {
        userId: socket.id,
        username: socket.data.username,
      });
    } else {
      // Enviando uma mensagem indicando que nenhum usuário está digitando para todos os clientes
      socket.broadcast.emit('user typing', false);
    }
  });
});

// Iniciando o servidor na porta especificada
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});
