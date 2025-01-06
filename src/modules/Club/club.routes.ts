import { Router } from "express";
import {
  editProfile,
  editBio,
  getStaff,
  getClub,
  getClubUserID,
  getClubs,
  addTryout,
} from "./club.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);
router.put("/editBio/:id", editBio as any);

router.post("/tryouts", addTryout as any);

router.get("/getStaff/:id", getStaff as any);
router.get("/:id", getClub as any);
router.get("/user/:id", getClubUserID as any);
router.get("/", getClubs as any);

export default router;
