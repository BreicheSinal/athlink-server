import { Router } from "express";
import { register, login } from "./auth.controller";
import { registrationLimiter } from "../middlewares/rate.limiter";

const router = Router();

router.post("/register", registrationLimiter, register);
router.post("/login", login);

export default router;
