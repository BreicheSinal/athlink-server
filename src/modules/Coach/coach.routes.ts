import { Router } from "express";
import {
  editProfile,
  getCoach,
  editBio,
  getCoachUserID,
} from "./coach.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);
router.put("/editBio/:id", editBio as any);

router.get("/:id", getCoach as any);
router.get("/user/:id", getCoachUserID as any);

export default router;
