import { Router } from "express";
import { editProfile, editBio } from "./federation.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);
router.put("/editBio/:id", editBio as any);

export default router;
