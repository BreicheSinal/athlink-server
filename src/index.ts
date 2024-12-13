import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

const app: Express = express();
dotenv.config();

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${process.env.SERVER_PORT}`);
});
