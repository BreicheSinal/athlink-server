import dotenv from "dotenv";

// loading variables from .env
dotenv.config();

// defining types for variables
interface Env {
  DB_HOST: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_PORT: string;
}

// destructuring variables
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT }: Env =
  process.env as unknown as Env;
