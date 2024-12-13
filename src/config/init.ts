import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

export const init = (app : Express) => {
  dotenv.config();

  app.use(cors());
};
