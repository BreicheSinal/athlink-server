import { Router } from "express";
import { createConnection, updateConnectionStatus } from "./user.controller";

const router = Router();

router.post("/:connectedUserId", createConnection as any);

router.put("/:connectedUserId", updateConnectionStatus as any);

export default router;
