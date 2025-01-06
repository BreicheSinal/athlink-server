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
  addExperienceCertification,
  editExperienceCertification,
  deleteExperienceCertification,
} from "./user.controller";

const router = Router();

router.post("/chats", createChat as any);
router.post("/:connectedUserId", createConnection as any);
router.post("/chats/messages", sendMessage as any);
router.post("/addExpCert/:user_id", addExperienceCertification as any);

router.put("/:connectedUserId", updateConnectionStatus as any);
router.put("/editExpCert/:exp_id", editExperienceCertification as any);

router.get("/", getConnections as any);
router.get("/pending", getPendingConnections as any);
router.get("/accepted/:userId", getAcceptedConnections as any);
router.get("/:currentUserId/search", searchUsers as any);
router.get("/:connectedUserId", getStatusConnection as any);
router.get("/chats/user/:userId", getUserChats as any);
router.get("/chats/messages", getChatMessages as any);

router.delete("/deleteExpCert/:exp_id", deleteExperienceCertification as any);

export default router;
