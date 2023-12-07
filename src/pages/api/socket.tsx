import { Server } from "socket.io";
import messageHandler from "../../utils/sockets/messageHandler";

export default function SocketHandler(req, res) {
  // It means that socket server was already initialised
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  // Define actions inside
  io.on("connection", (socket) => {
    socket.emit("respond", "Hello, I'm a bot. How can I help you?");

    const createdMessage = (msg) => {
      socket.broadcast.emit("respond", msg);
      socket.emit("respond", "Let me think...");
    };

    socket.on("prompt", createdMessage);
  });

  console.log("Setting up socket");
  res.end();
}
