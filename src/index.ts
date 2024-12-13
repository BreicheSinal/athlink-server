import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 8080;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
