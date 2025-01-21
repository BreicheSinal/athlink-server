import { init } from "./config/init";
import { initializeSocket } from "./config/socket";
import http from "http";
import express, { Express, Request, Response, NextFunction } from "express";
import { connectToDatabase } from "./db/connection";
import "reflect-metadata";

import auth from "./modules/Auth/auth.routes";
import athlete from "./modules/Athlete/athlete.routes";
import trophy from "./modules/Trophy/trophy.routes";
import club from "./modules/Club/club.routes";
import federation from "./modules/Federation/federation.routes";
import coach from "./modules/Coach/coach.routes";
import user from "./modules/User/user.routes";
import notes from "./modules/Notes/notes.routes";
import { authenticateJWT } from "./middlewares/jwt.auth";

const app: Express = express();
const server = http.createServer(app);

init(app);
initializeSocket(server);

app.use(express.json());

const publicPaths = [
  "/login",
  "/register",
];

app.use((req: Request, res: Response, next: NextFunction) => {
  const isPublicPath = publicPaths.some((path) =>
    req.path.toLowerCase().includes(path.toLowerCase())
  );

  if (isPublicPath) {
    return next();
  }

  return authenticateJWT(req, res, next);
});

app.use("/", auth); 
app.use("/athlete", athlete);
app.use("/", trophy);
app.use("/club", club);
app.use("/federation", federation);
app.use("/coach", coach);
app.use("/user", user);
app.use("/notes", notes);

server.listen(process.env.SERVER_PORT, async () => {
  try {
    console.log(
      `Server running at http://localhost:${process.env.SERVER_PORT}`
    );
    await connectToDatabase();
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
});
