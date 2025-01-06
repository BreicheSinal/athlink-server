import { Router } from "express";
import {
  editProfile,
  editBio,
  addTrophy,
  editExperienceCertification,
  getAthlete,
  getAthleteUserID,
  deleteExperienceCertification,
} from "./athlete.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);
router.put("/editBio/:id", editBio as any);
router.put("/editExpCert/:exp_id", editExperienceCertification as any);

router.post("/addTrophy/:entity_id", addTrophy as any);


router.get("/:id", getAthlete as any);
router.get("/user/:id", getAthleteUserID as any);

router.delete("/deleteExpCert/:exp_id", deleteExperienceCertification as any);

export default router;
