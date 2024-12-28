import { init } from "./config/init";
import express, { Express } from "express";
import { connectToDatabase } from "./db/connection";
import "reflect-metadata";
import auth from "./modules/Auth/auth.routes";
import athlete from "./modules/Athlete/athlete.routes";
import trophy from "./modules/Trophy/trophy.routes";
import club from "./modules/Club/club.routes";
import federation from "./modules/Federation/federation.routes";
import coach from "./modules/Coach/coach.routes";

const app: Express = express();

init(app);

app.use(express.json());

app.use("/", auth);
app.use("/athlete", athlete);
app.use("/", trophy);
app.use("/club", club);
app.use("/federation", federation);
app.use("/coach", coach);

app.listen(process.env.SERVER_PORT, async () => {
  console.log(`Server running at http://localhost:${process.env.SERVER_PORT}`);
  connectToDatabase();
});
