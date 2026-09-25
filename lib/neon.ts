import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL || "")

export async function ensureLinksTable() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured")
  }

  await sql`
    CREATE TABLE IF NOT EXISTS links (
      code TEXT PRIMARY KEY,
      target_url TEXT NOT NULL,
      visits INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `
}