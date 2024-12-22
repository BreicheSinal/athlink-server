import { Router } from "express";
import {
  editProfile,
  editBio,
  getClubs,
  getFederations,
} from "./federation.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);
router.put("/editBio/:id", editBio as any);

router.get("/getClubs/:id", getClubs as any);
router.get("/getFederations", getFederations as any);

export default router;
