import { init } from "./config/init";
import express, { Express } from "express";
import { connectToDatabase } from "./db/connection";
import "reflect-metadata";
import auth from "./modules/Auth/auth.routes";

const app: Express = express();

init(app);
app.use("/", auth);

app.listen(process.env.SERVER_PORT, async () => {
  console.log(`Server running at http://localhost:${process.env.SERVER_PORT}`);
  connectToDatabase();
});
