import { Router } from "express";
import {
  createConnection,
  updateConnectionStatus,
  getConnections,
  getPendingConnections,
  searchUsers,
  getStatusConnection,
} from "./user.controller";

const router = Router();

router.post("/:connectedUserId", createConnection as any);

router.put("/:connectedUserId", updateConnectionStatus as any);

router.get("/", getConnections as any);
router.get("/pending", getPendingConnections as any);
router.get("/:currentUserId/search", searchUsers as any);
router.get("/:connectedUserId", getStatusConnection as any);

export default router;
