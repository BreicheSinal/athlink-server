import { Router } from "express";
import { editProfile, editBio, getStaff } from "./club.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);
router.put("/editBio/:id", editBio as any);

router.get("/getStaff/:id", getStaff as any);

export default router;
