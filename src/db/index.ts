import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/db/schema";
import "dotenv/config";
import assert from "node:assert";

assert(process.env.DB_URL, "DB_URL environment variable is required");

export const sql = neon(process.env.DB_URL);
const db = drizzle(sql, { schema });

export default db;
