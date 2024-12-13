import mysql from "mysql2/promise";
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

// set up db connection
export const connectToDatabase = async () => {
  try {
    const dbPort = Number(DB_PORT);

    if (isNaN(dbPort) || dbPort <= 0) {
      throw new Error(`Invalid DB_PORT`);
    }

    const db = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: dbPort,
    });

    console.log(`Connected to database successfully!`);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error: ${errorMessage}`);

    process.exit(1);
  }
};
