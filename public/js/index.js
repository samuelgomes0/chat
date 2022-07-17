const socket = io();

class FrontEnd {
  constructor(socket) {
    this.socket = socket;
    this.sendMessage();
    this.getAndChangeUsername();
    this.listenToUserConnection();
    this.listenForMessages();
  }

  sendMessage() {
    const messagesForm = document.querySelector(".messages__form");
    const messagesInput = document.querySelector(".messages__form__input");

    messagesForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (messagesInput.value) {
        this.socket.emit("chat message", messagesInput.value);
        messagesInput.value = "";
      }
    });
  }

  getAndChangeUsername() {
    const usernameForm = document.querySelector(".username-form");
    const usernameInput = document.querySelector(".username-input");
    let userName = document.querySelector(".chat__header__username");

    if (localStorage.getItem("username")) {
      userName.innerText = localStorage.getItem("username");

      this.socket.emit("get username", localStorage.getItem("username"));
    } else {
      usernameForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (usernameInput.value) {
          userName.innerText = usernameInput.value;
          usernameInput.value = "";

          this.socket.emit("get username", userName.innerText);

          this.socket.on("change username", (userId) => {
            if (localStorage.getItem("username") === true) {
              userName = localStorage.getItem("username");
              return;
            } else {
              localStorage.setItem("username", userId);
            }
          });
        }
      });
    }
  }

  listenToUserConnection() {
    const messages = document.querySelector(".messages");
    const joinOrLeftMessage = document.createElement("li");

    this.socket.on("user joined", ({ userId }) => {
      joinOrLeftMessage.innerText = `Usuário ${userId} conectado.`;
      messages.appendChild(joinOrLeftMessage).classList.add("message");
      messages.scrollTo(0, messages.scrollHeight);
    });

    this.socket.on("user left", ({ userId }) => {
      joinOrLeftMessage.innerText = `Usuário ${userId} desconectado.`;
      messages.appendChild(joinOrLeftMessage).classList.add("message");
      messages.scrollTo(0, messages.scrollHeight);
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
}

const frontEnd = new FrontEnd(socket);
