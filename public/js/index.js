const socket = io();

const joinScreen = document.querySelector(".join-screen");
const blurScreen = document.querySelector(".blur");
const form = document.querySelector(".join-form");
const usernameInput = document.getElementById("username");
const searchUser = document.getElementById("search-user");
const yourName = document.getElementById("your-name");

// Get username from local storage or ask for it
if (localStorage.getItem("username")) {
  yourName.innerText = localStorage.getItem("username");

  socket.emit("join", localStorage.getItem("username"));

  joinScreen.classList.remove("active");
  blurScreen.classList.remove("active");
} else {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value;

    if (username.length >= 3) {
      socket.emit("join", username);

      yourName.innerText = username;

      localStorage.setItem("username", username);

      socket.emit("join", username);

      joinScreen.classList.remove("active");
      blurScreen.classList.remove("active");
    }
  });
}

// Search for users
searchUser.addEventListener("keyup", () => {
  const searchValue = searchUser.value;
  const users = document.querySelectorAll(".user");
  let index = 0;

  for (index; index < users.length; index++) {
    const username = users[index].querySelector("h3").innerText;

    if (username.toLowerCase().startsWith(searchValue.toLowerCase())) {
      users[index].style.display = "flex";
    } else {
      users[index].style.display = "none";
    }
  }
});

// Send message
const messageForm = document.querySelector(".message-form");
const messageInput = document.getElementById("message-input");

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = messageInput.value;

  if (message.length > 0) {
    socket.emit("message", message);

    messageInput.value = "";
  }
});

// Receive message
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
yourName.addEventListener("click", () => {
  const username = prompt("Enter your new username");

  if (username.length >= 3) {
    socket.emit("change username", username);

    yourName.innerText = username;

    localStorage.setItem("username", username);
  }
});
