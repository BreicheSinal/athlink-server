import { Router } from "express";
import {
  requestTrophy,
  verifyTrophy,
  getTrophyById,
  getTrophiesByOwner,
} from "./trophy.controller";

const router = Router();

router.post("/req/trophy", requestTrophy);
router.post("/verify/trophy/:id", verifyTrophy);

router.get("/trophy/:id", getTrophyById);
router.get("/trophies/owner/:address", getTrophiesByOwner as any);

export default router;
