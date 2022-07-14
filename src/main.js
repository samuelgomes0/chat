import { v4 as uuidv4 } from "uuid";

class BackEnd {
  constructor(io) {
    this.io = io;
    this.onUserConnection();
  }

  onUserConnection() {
    this.io.on("connection", (socket) => {
      let userId = uuidv4();

      socket.broadcast.emit("user joined", { userId });

      socket.on("disconnect", () => {
        socket.broadcast.emit("user left", { userId });
      });

      socket.on("get username", (username) => {
        userId = username;

        this.io.emit("change username", userId);
      });

      socket.on("chat message", (message) => {
        this.io.emit("chat message", `${userId}: ${message}`);
      });
    });
  }
}

export default BackEnd;
