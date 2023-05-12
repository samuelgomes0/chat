const socket = io();

const joinScreen = document.querySelector(".join-screen");
const blurScreen = document.querySelector(".blur");
const form = document.querySelector(".join-form");
const usernameInput = document.getElementById("username");
const searchUser = document.getElementById("search-user");
const yourName = document.getElementById("your-name");
const messageForm = document.querySelector(".message-form");

function handleUsername() {
  const username = localStorage.getItem("username");

  if (username) {
    yourName.innerText = username;

    joinScreen.classList.remove("active");
    blurScreen.classList.remove("active");

    socket.emit("join", username);
  } else {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = usernameInput.value;

      if (username.length >= 3) {
        yourName.innerText = username;

        localStorage.setItem("username", username);

        joinScreen.classList.remove("active");
        blurScreen.classList.remove("active");

        socket.emit("join", username);
      }
    });
  }
}

function searchUsers() {
  searchUser.addEventListener("keyup", () => {
    const searchValue = searchUser.value;
    const users = document.querySelectorAll(".user");
    const noUsersFoundElement = document.querySelector(".no-users-found");
    let index = 0;

    for (index; index < users.length; index++) {
      const username = users[index].querySelector("h3").innerText;

      if (username.toLowerCase().startsWith(searchValue.toLowerCase())) {
        users[index].style.display = "flex";

        noUsersFoundElement.style.display = "none";
      } else {
        users[index].style.display = "none";

        noUsersFoundElement.style.display = "flex";
      }
    }
  });
}

// Send message
function sendMessage() {
  const messageInput = document.getElementById("message-input");

  messageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = messageInput.value;

    if (message.length > 0) {
      socket.emit("message", message);

      messageInput.value = "";
    }
  });
}

// Receive message
function receiveMessage() {
  socket.on("message", ({ message, time, username }) => {
    const messages = document.querySelector(".messages");
    const messageElement = document.createElement("li");
    const messageInfo = document.createElement("div");
    const usernameElement = document.createElement("h3");
    const timeElement = document.createElement("span");
    const messageText = document.createElement("p");

    messageElement.classList.add("message");
    messageInfo.classList.add("message-info");
    messageText.classList.add("message-text");

    messages.appendChild(messageElement);
    messageElement.appendChild(messageInfo);
    messageInfo.appendChild(usernameElement);
    messageInfo.appendChild(timeElement);
    messageElement.appendChild(messageText);

    usernameElement.innerText = username;
    timeElement.innerText = time;
    messageText.innerText = message;

    messages.scrollTo(0, messages.scrollHeight);
  });
}

function userIsTyping() {
  const messageInput = document.getElementById("message-input");
  const userIsTyping = document.querySelector(".user-is-typing");
  const userIsTypingName = userIsTyping.children[0].textContent;

  messageInput.addEventListener("keyup", () => {
    const message = messageInput.value;

    if (message.length > 0) {
      socket.emit("user is typing", userIsTypingName);
    } else {
      userIsTyping.classList.remove("active");
    }
  });

  socket.on("user is typing", ({ username }) => {
    userIsTyping.classList.add("active");
    userIsTyping.children[0].textContent = username;

    setTimeout(() => {
      userIsTyping.classList.remove("active");
    }, 3000);
  });

  messageForm.addEventListener("submit", () => {
    userIsTyping.classList.remove("active");

    console.log("submit");
  });
}

// Insert new user in the list
socket.on("insert user", ({ username }) => {
  const usersList = document.querySelector(".users");
  const userElement = document.createElement("li");
  const usernameElement = document.createElement("h3");
  const userInfoElement = document.createElement("div");
  const userStatusElement = document.createElement("span");
  const userStatusTextElement = document.createElement("p");

  userElement.classList.add("user");
  userInfoElement.classList.add("user-info");
  userStatusElement.classList.add("online");

  usersList.appendChild(userElement);
  userElement.appendChild(usernameElement);
  userElement.appendChild(userInfoElement);
  userInfoElement.appendChild(userStatusElement);
  userInfoElement.appendChild(userStatusTextElement);

  usernameElement.innerText = username;
  userStatusTextElement.innerText = "Online";

  usersList.scrollTo(0, usersList.scrollHeight);
});

// Remove user from the list
socket.on("remove user", ({ username }) => {
  const usersList = document.querySelector(".users");
  const users = document.querySelectorAll(".user");
  let index = 0;

  for (index; index < users.length; index++) {
    const usernameElement = users[index].querySelector("h3");

    if (usernameElement.innerText === username) {
      usersList.removeChild(users[index]);
    }
  }
});

// Change username
function changeUsername() {
  yourName.addEventListener("click", () => {
    const changeUsernameForm = document.querySelector(".change-username-form");
    const changeUsernameScreen = document.querySelector(
      ".change-username-screen"
    );

    changeUsernameScreen.classList.add("active");
    blurScreen.classList.add("active");

    changeUsernameForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const usernameInput = document.getElementById("change-username");
      const username = usernameInput.value;

      if (username.length >= 3) {
        yourName.innerText = username;

        localStorage.setItem("username", username);

        usernameInput.value = "";

        changeUsernameScreen.classList.remove("active");
        blurScreen.classList.remove("active");

        socket.emit("change username", username);
      }
    });
  });
}

handleUsername();
searchUsers();
sendMessage();
receiveMessage();
userIsTyping();
changeUsername();
