import { Router } from "express";
import {
  editProfile,
  editBio,
  getClubs,
  getFederations,
  getFederation,
  getFederationUserID,
} from "./federation.controller";

const router = Router();

router.put("/editProfile/:id", editProfile as any);
router.put("/editBio/:id", editBio as any);

router.get("/getClubs/:id", getClubs as any);
router.get("/getFederations", getFederations as any);
router.get("/:id", getFederation as any);
router.get("/user/:id", getFederationUserID as any);

export default router;
