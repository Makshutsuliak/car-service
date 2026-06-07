import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.js";
dotenv.config();
console.log("DB type:", typeof db, db);

if (!process.env.DRIZZLE_DATABASE_URL) {
  throw new Error("DRIZZLE_DATABASE_URL is not defined");
}

export const db = neon(process.env.DRIZZLE_DATABASE_URL);

