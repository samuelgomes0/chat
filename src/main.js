import { v4 as uuidv4 } from "uuid";

class BackEnd {
  constructor(io) {
    this.io = io;
    this.onUserConnection();
  }

  onUserConnection() {
    this.io.on("connection", (socket) => {
      const userId = uuidv4();

      this.io.emit("chat message", `User ${userId} connected`);

      socket.on("disconnect", () => {
        this.io.emit("chat message", `User ${userId} disconnected`);
      });

      socket.on("chat message", (message) => {
        this.io.emit("chat message", `User ${userId}: ${message}`);
      });
    });
  }
}

export default BackEnd;
