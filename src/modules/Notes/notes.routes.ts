import express from "express";
import { processNotes } from "./notes.controller";
import { notesLimiter } from "../../middlewares/rate.limiter";
import { validateNotes } from "../../middlewares/validation";

const router = express.Router();

router.post("/process", notesLimiter, validateNotes, processNotes as any);

export default router;
