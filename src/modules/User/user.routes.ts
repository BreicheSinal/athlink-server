import { Router } from "express";
import {
  createConnection,
  updateConnectionStatus,
  getConnections,
  getPendingConnections,
  getAcceptedConnections,
  searchUsers,
  getStatusConnection,
  createChat,
  getUserChats,
  sendMessage,
  getChatMessages,
} from "./user.controller";

const router = Router();

router.post("/chats", createChat as any);
router.post("/:connectedUserId", createConnection as any);
router.post("/chats/messages", sendMessage as any);

router.put("/:connectedUserId", updateConnectionStatus as any);

router.get("/", getConnections as any);
router.get("/pending", getPendingConnections as any);
router.get("/accepted/:userId", getAcceptedConnections as any);
router.get("/:currentUserId/search", searchUsers as any);
router.get("/:connectedUserId", getStatusConnection as any);
router.get("/chats/user/:userId", getUserChats as any);
router.get("/chats/messages", getChatMessages as any);

export default router;
