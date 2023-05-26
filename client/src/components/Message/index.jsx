import PropTypes from "prop-types";

export default function Message({ message, socket }) {
  const isUserMessage = message.userId === socket.id;

  Message.propTypes = {
    message: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
  };

  return (
    <li className={`w-fit ${isUserMessage ? "place-self-end" : ""}`}>
      <div className="flex items-center justify-between gap-4">
        {!isUserMessage && (
          <h3 className="mb-1 text-sm font-semibold">{message.username}</h3>
        )}
      </div>
      <p
        className={`rounded bg-neutral-200 p-2 ${
          isUserMessage ? "bg-purple-700 text-white" : ""
        }`}
      >
        {message.text}
        <span
          className={`ml-5 text-xs text-gray-400 ${
            isUserMessage ? "text-white" : ""
          }`}
        >
          {message.time}
        </span>
      </p>
    </li>
  );
}
