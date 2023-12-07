import { Server } from "socket.io";

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
    console.log("New connectionr", socket.id);
    const createdMessage = (msg: { message: string }) => {
      // call the modal here
      socket.emit("respond", { message: "Let me check..." });
    };

    socket.on("prompt", createdMessage);

    socket.on("disconnect", () => {
      console.log("Disconnected: ", socket.id);
      socket.off("prompt", createdMessage);
      socket.offAny();
      socket.disconnect();
    });

    // send initial message
    socket.emit("respond", { message: "Hello, How can I help you?" });
  });
  res.end();
}
