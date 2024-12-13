import { init } from "./config/init";
import express, { Express } from "express";
import connectToDatabase  from "./db/connection";

const app: Express = express();

init(app);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${process.env.SERVER_PORT}`);
  connectToDatabase();
});
