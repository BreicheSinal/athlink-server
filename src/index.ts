import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

const app: Express = express();

dotenv.config();

app.use(cors());

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${process.env.SERVER_PORT}`);
});
