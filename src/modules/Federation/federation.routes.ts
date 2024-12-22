import { Router } from "express";
import { editProfile } from "./federation.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);

export default router;
