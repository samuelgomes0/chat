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
    <section className="flex h-screen w-screen gap-4 p-8">
      <div className="flex h-full w-1/4 flex-col justify-between gap-4">
        <input
          type="text"
          placeholder="Search"
          autoComplete="off"
          className="w-full rounded-xl border border-gray-300 bg-white p-3.5 text-sm shadow-sm transition-colors hover:bg-neutral-100 focus:border-transparent focus:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <ul className="h-full overflow-y-auto rounded-xl border border-gray-300 bg-white shadow-sm">
          {onlineUsers.map(
            (user, index) =>
              user.id !== socket.id && (
                <li
                  key={index}
                  className="h-20 border-b border-gray-200 p-4 transition-colors hover:cursor-pointer hover:bg-neutral-200"
                >
                  <h3 className="font-semibold">{user.username}</h3>
                  <p className="text-sm text-gray-500">{lastMessage}</p>
                </li>
              )
          )}
        </ul>
        <div className="flex justify-between rounded-xl border border-gray-300 bg-white p-4 text-center shadow-sm">
          <h3
            title="Change your username"
            onClick={() => changeUsername()}
            className="cursor-pointer font-semibold hover:underline"
          >
            {username}
          </h3>
          <button
            onClick={() => handleLogout()}
            className="text-xs font-semibold text-purple-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex h-full w-full flex-col justify-between gap-4 rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
        <ul className="flex h-full flex-col gap-4 overflow-y-auto">
          {messageList.map((message, index) => (
            <Message key={index} message={message} socket={socket} />
          ))}
          <div ref={bottomRef} />
        </ul>
        {isTyping && <p>User {userTypingRef.current} is typing...</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your message"
            autoComplete="off"
            className="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-sm transition-colors hover:bg-neutral-100 focus:border-transparent focus:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
            ref={messageRef}
            onChange={handleTyping}
          />
        </form>
      </div>
    </section>
  );
}
