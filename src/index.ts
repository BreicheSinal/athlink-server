import { init } from "./config/init";
import express, { Express } from "express";

const app: Express = express();

init(app);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server running at http://localhost:${process.env.SERVER_PORT}`);
});
