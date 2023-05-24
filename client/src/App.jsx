import { useState } from "react";

import Chat from "./components/Chat/";
import Join from "./components/Join/";

export default function App() {
  const [chatVisible, setChatVisible] = useState(false);
  const [socket, setSocket] = useState(null);

  return (
    <main className="flex h-screen w-screen items-center justify-center bg-gray-100">
      {chatVisible ? (
        <Chat socket={socket} />
      ) : (
        <Join setChatVisible={setChatVisible} setSocket={setSocket} />
      )}
    </main>
  );
}
