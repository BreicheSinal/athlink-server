import { DataSource } from "typeorm";
import dotenv from "dotenv";
import "reflect-metadata";
import { join } from "path";

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

const dbPort = Number(DB_PORT);

if (isNaN(dbPort) || dbPort <= 0) {
  throw new Error(`Invalid DB_PORT`);
}

const AppDataSource = new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: dbPort,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  logging: true,
  entities: [join(__dirname, "src/entities/**/*.{ts}")],
  migrations: [],
  subscribers: [],
});

// set up db connection
const connectToDatabase = async () => {
  try {
    await AppDataSource.initialize();

    console.log(`Connected to database successfully!`);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`Error: ${errorMessage}`);

    process.exit(1);
  }
};

export default connectToDatabase;
