import { Server } from "socket.io";
import http from "http";
import { AppDataSource } from "../db/connection";
import { ChatMessage } from "../db/entities/ChatMessage";
import { User } from "../db/entities/User";
import { Chat } from "../db/entities/Chat";

interface SocketMessage {
  chatId: number;
  message: string;
}

export const initializeSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 60000,
    transports: ["polling", "websocket"],
    allowEIO3: true,
    path: "/socket.io/",
  });

  const onlineUsers = new Map<string, number>();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User joining with their userIDs
    socket.on("join", (userId: number) => {
      onlineUsers.set(socket.id, userId);
      console.log("User joined:", { socketId: socket.id, userId });
      console.log("Current online users:", Array.from(onlineUsers.entries()));
    });

    socket.on("sendMessage", async (data: SocketMessage) => {
      try {
        const senderId = onlineUsers.get(socket.id);
        if (!senderId) {
          socket.emit("messageError", { error: "Sender not found" });
          return;
        }

        const messageRepository = AppDataSource.getRepository(ChatMessage);
        const userRepository = AppDataSource.getRepository(User);
        const chatRepository = AppDataSource.getRepository(Chat);

        const [sender, chat] = await Promise.all([
          userRepository.findOne({ where: { id: senderId } }),
          chatRepository.findOne({
            where: { id: data.chatId },
            relations: ["user1", "user2"],
          }),
        ]);

        if (!sender || !chat) {
          socket.emit("messageError", { error: "Invalid sender or chat" });
          return;
        }

        const newMessage = messageRepository.create({
          chat: chat,
          sender: sender,
          message: data.message,
        });

        const savedMessage = await messageRepository.save(newMessage);

        const receiverId =
          chat.user1.id === sender.id ? chat.user2.id : chat.user1.id;

        const messageData = {
          id: savedMessage.id,
          chatId: chat.id,
          senderId: sender.id,
          receiverId: receiverId,
          message: data.message,
          timestamp: savedMessage.created_at.toISOString(),
        };

        io.to(`chat_${data.chatId}`).emit("newMessage", messageData);
        console.log("Message sent to chat room:", `chat_${data.chatId}`);
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit("messageError", { error: "Failed to send message" });
      }
    });

    socket.on("joinChat", (chatId: number) => {
      socket.join(`chat_${chatId}`);
      console.log(`Socket ${socket.id} joined chat room: chat_${chatId}`);
    });

    socket.on("disconnect", () => {
      const userId = onlineUsers.get(socket.id);
      console.log("User disconnected:", { socketId: socket.id, userId });
      onlineUsers.delete(socket.id);
    });
  });

  const activeConnections = new Set();

  io.on("connection", (socket) => {
    activeConnections.add(socket.id);
    console.log(`Active connections: ${activeConnections.size}`);

    socket.on("disconnect", () => {
      activeConnections.delete(socket.id);
    });
  });

  return io;
};
