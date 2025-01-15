import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

export const init = (app: Express) => {
  app.use(
    cors({
      origin: `http://localhost:${process.env.PORT}`,
      credentials: true,
    })
  );

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
};
