export default function Message({ message, className, socket }) {
  return (
    <Container className={className}>
      <div className="infos">
        {message.userId === socket.id ? (
          ""
        ) : (
          <h3 className="username">{message.username}</h3>
        )}
        <span>{message.time}</span>
      </div>
      <p>{message.text}</p>
    </Container>
  );
}
