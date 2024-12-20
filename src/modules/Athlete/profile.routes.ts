import { Router } from "express";
import { editProfile, editBio, addTrophy } from "./profile.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);
router.put("/editBio/:id", editBio as any);
router.post("/addTrophy/:entity_id", addTrophy as any);

export default router;
