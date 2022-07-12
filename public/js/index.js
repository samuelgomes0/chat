const socket = io();

class FrontEnd {
  constructor(socket) {
    this.socket = socket;
    this.sendMessage();
    this.listenForMessages();
  }

  sendMessage() {
    const form = document.querySelector(".form");
    const input = document.querySelector(".input");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (input.value) {
        this.socket.emit("chat message", input.value);
        input.value = "";
      }
    });
  }

  listenForMessages() {
    const messages = document.querySelector(".messages");

    this.socket.on("chat message", (message) => {
      const userMessage = document.createElement("li");
      userMessage.innerText = message;
      messages.appendChild(userMessage).classList.add("message");
      messages.scrollTo(0, messages.scrollHeight);
    });
  }

  listenForUserConnections() {
    this.socket.on("user connected", (user) => {
      const userMessage = document.createElement("li");
      userMessage.innerText = `${user} connected`;
      messages.appendChild(userMessage).classList.add("user-name");
    });
  }
}

const frontEnd = new FrontEnd(socket);
