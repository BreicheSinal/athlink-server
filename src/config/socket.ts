import { Server } from "socket.io";
import http from "http";

export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  // Storing online users
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
  });

  return io;
};
