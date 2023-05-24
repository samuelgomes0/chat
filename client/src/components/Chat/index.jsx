/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import Message from "../Message";

export default function Chat({ socket }) {
  const [messageList, setMessageList] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [username, setUsername] = useState("");
  const [lastMessage, setLastMessage] = useState("");

  const messageRef = useRef();
  const userTypingRef = useRef();
  const bottomRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = messageRef.current.value;

    if (!text.trim()) return;

    socket.emit("message", text);
    socket.emit("user typing", false);

    clearInput();
  };

  const handleLogout = () => {
    socket.emit("logout");

    window.location.reload();
  };

  const clearInput = () => {
    messageRef.current.value = "";
  };

  const changeUsername = () => {
    const newUsername = prompt("Enter your new username");

    if (!newUsername.trim()) return;

    socket.emit("change username", newUsername);

    setUsername(newUsername);
  };

  const handleTyping = () => {
    const text = messageRef.current.value;

    if (!text.trim()) {
      setInterval(() => {
        socket.emit("user typing", false);
      }, 2000);

      return;
    }

    socket.emit("user typing", true);
  };

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.on("user joined", (user) => {
      setUsername(user.username);
    });

    socket.on("receive message", (message) => {
      setMessageList((previous) => [...previous, message]);
      setLastMessage(message.text);
    });

    socket.on("user typing", (isTyping) => {
      setIsTyping(isTyping);
      userTypingRef.current = isTyping.username;

      if (!isTyping) {
        setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    });

    socket.on("online users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("user joined");
      socket.off("receive message");
      socket.off("user typing");
      socket.off("online users");
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  return (
    <section className="flex h-screen w-screen">
      <div className="flex h-full flex-col justify-between border-r border-gray-300 bg-gray-50">
        <div className="border-b border-gray-300 p-5">
          <input
            type="text"
            placeholder="Search for users"
            autoComplete="off"
            className="rounded border border-neutral-300 p-2 transition-colors hover:bg-gray-100 focus:border-transparent focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </div>
        <ul className="h-full overflow-y-auto">
          {onlineUsers.map(
            (user, index) =>
              user.id !== socket.id && (
                <li key={index}>
                  <h3>{user.username}</h3>
                </li>
              )
          )}
        </ul>
        <div className="flex justify-between border-t border-gray-300 p-5">
          <h3
            title="Change your username"
            onClick={() => changeUsername()}
            className="cursor-pointer text-xl font-semibold hover:underline"
          >
            {username}
          </h3>
          <button
            onClick={() => handleLogout()}
            className="text-sm font-semibold text-purple-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex h-screen w-full flex-col">
        <ul className="h-full">
          {messageList.map((message, index) => (
            <Message
              key={index}
              message={message}
              className={message.userId === socket.id ? "my-message" : ""}
              socket={socket}
            />
          ))}
          <div ref={bottomRef} />
        </ul>
        {isTyping && <p>User {userTypingRef.current} is typing...</p>}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-300 bg-gray-50 p-5"
        >
          <input
            type="text"
            placeholder="Type your message"
            ref={messageRef}
            onChange={() => handleTyping()}
            className="w-full rounded border border-neutral-300 p-2  transition-colors hover:bg-gray-100 focus:border-transparent focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
        </form>
      </div>
    </section>
  );
}
