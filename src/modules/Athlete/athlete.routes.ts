import { Router } from "express";
import {
  editProfile,
  editBio,
  addTrophy,
  getAthlete,
  getAthleteUserID,
  applyTryOut,
} from "./athlete.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);
router.put("/editBio/:id", editBio as any);

router.post("/addTrophy/:entity_id", addTrophy as any);
router.post("/tryout/apply", applyTryOut as any);

router.get("/:id", getAthlete as any);
router.get("/user/:id", getAthleteUserID as any);

export default router;
