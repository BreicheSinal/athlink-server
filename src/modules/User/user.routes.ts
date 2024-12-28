import { Router } from "express";
import {
  createConnection,
  updateConnectionStatus,
  getConnections,
} from "./user.controller";

const router = Router();

router.post("/:connectedUserId", createConnection as any);

router.put("/:connectedUserId", updateConnectionStatus as any);

router.get("/", getConnections as any);

export default router;
