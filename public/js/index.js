const socket = io();

class FrontEnd {
  constructor(socket) {
    this.socket = socket;
    this.sendMessage();
    this.listenForMessages();
    this.userNotificationpermission();
    this.verifyUserOnPage();
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
      this.notifyUser(message);
    });
  }

  listenForUserConnections() {
    this.socket.on("user connected", (user) => {
      const userMessage = document.createElement("li");
      userMessage.innerText = `${user} connected`;
      messages.appendChild(userMessage).classList.add("user-name");
    });
  }
  
  userNotificationpermission(){
    Notification.requestPermission();
  }

  notifyUser(message, user){    

    if(!this.userOnPage){
      const notify = new Notification("Whatsapp 2", {
        body: message,
        icon: "https://appsgeyser.io/geticon.php?widget=whatsapp%202_13754110&width=512"
      });
    }
  }

  verifyUserOnPage(){
    this.userOnPage = true;
    window.addEventListener("blur", ()=>{
      this.userOnPage = false;
    });
    window.addEventListener("focus", ()=>{
      this.userOnPage = true;
    });
  }

}

const frontEnd = new FrontEnd(socket);
