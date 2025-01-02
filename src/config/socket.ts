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

    // User joining with their userIDs
    socket.on("join", (userId: number) => {
      onlineUsers.set(socket.id, userId);
      console.log("User joined:", userId);
    });

    // New messages
    socket.on(
      "sendMessage",
      (data: { receiverId: number; message: string }) => {
        const receiverSocketId = Array.from(onlineUsers.entries()).find(
          ([_, id]) => id === data.receiverId
        )?.[0];

        if (receiverSocketId) {
          // Emitting to specific user
          io.to(receiverSocketId).emit("newMessage", {
            senderId: onlineUsers.get(socket.id),
            ...data,
          });
        }
      }
    );
  });

  return io;
};
