/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { useRef } from "react";
import io from "socket.io-client";

export default function Join({ setChatVisible, setSocket }) {
  const usernameRef = useRef();

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    const username = usernameRef.current.value;

    if (!username.trim()) return;

    const user = {
      username,
    };

    localStorage.setItem("user", JSON.stringify(user));

    const socket = io("https://chat-ahbg.onrender.com");

    socket.emit("join", username);

    setChatVisible(true);
    setSocket(socket);
  };

  return (
    <section className="flex flex-col rounded bg-gray-100 p-10 shadow-sm">
      <div className="mb-8 text-center">
        <h1 className="mb-1 text-3xl font-bold">Join now</h1>
        <p className="text-neutral-600">Chat with your friends</p>
      </div>
      <form onSubmit={handleLoginSubmit} className="flex flex-col">
        <label htmlFor="username" className="mb-1 text-sm text-gray-600">
          Username
        </label>
        <input
          type="text"
          id="username"
          placeholder="Insert your username"
          autoComplete="off"
          ref={usernameRef}
          className="mb-4 rounded border border-neutral-300 p-2.5 text-sm transition-colors hover:bg-gray-100 focus:border-transparent focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-600"
        ></input>
        <button
          type="submit"
          className="my-4 rounded bg-violet-500 py-2 text-gray-100 transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
        >
          Join
        </button>
      </form>
      <p className="text-sm">
        Don't have an account?{" "}
        <a
          href="/register"
          className="font-semibold text-purple-600 hover:underline"
        >
          Register now
        </a>
      </p>
    </section>
  );
}
