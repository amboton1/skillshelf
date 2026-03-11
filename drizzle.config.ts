import "dotenv/config";
import { defineConfig } from "drizzle-kit";
import assert from "node:assert";

assert(process.env.DB_URL, "DB_URL environment variable is required");

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DB_URL,
  },
});
