import { Router } from "express";
import {
  editProfile,
  editBio,
  getStaff,
  getClub,
  getClubUserID,
  getClubs,
  addTryOut,
  deleteTryOut,
  getApplications,
  updateApplicationStatus,
} from "./club.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);
router.put("/editBio/:id", editBio as any);
router.put("/update/applications/:applicationId", updateApplicationStatus as any);

router.post("/tryouts", addTryOut as any);

router.get("/applications/:clubId", getApplications as any);
router.get("/getStaff/:id", getStaff as any);
router.get("/:id", getClub as any);
router.get("/user/:id", getClubUserID as any);
router.get("/", getClubs as any);

router.delete("/deleteTr/:trID", deleteTryOut as any);

export default router;
