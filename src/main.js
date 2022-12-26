class BackEnd {
  constructor(io) {
    this.io = io;
    this.onUserConnection();
  }

  onUserConnection() {
    this.io.on("connection", (socket) => {
      let userId = socket.id;

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
