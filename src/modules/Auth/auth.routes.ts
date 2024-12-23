import { Router } from "express";
import { register, login } from "./auth.controller";
import {
  registrationLimiter,
  loginLimiter,
} from "../../middlewares/rate.limiter";

const router = Router();

router.post("/register", registrationLimiter, register as any);
//router.post("/register", register as any);

router.post("/login", loginLimiter, login as any);

export default router;
