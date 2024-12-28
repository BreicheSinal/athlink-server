import { Router } from "express";
import { createConnection } from "./user.controller";

const router = Router();

router.post("/:connectedUserId", createConnection as any);

export default router;
