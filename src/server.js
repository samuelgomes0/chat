import express from "express";
import path from "path";

import { createServer } from "http";
import { Server } from "socket.io";

import BackEnd from "./main.js";

const app = express();
const port = process.env.PORT || 3000;
const __dirname = path.resolve();

const server = createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/public/"));

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

new BackEnd(io);
