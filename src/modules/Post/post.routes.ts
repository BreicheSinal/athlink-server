import express from "express";
import { createPost } from "./post.controller";
import { multerMiddleware } from "../../middlewares/multer";

const router = express.Router();

router.post("/create/:userId", multerMiddleware, createPost as any);

export default router;
