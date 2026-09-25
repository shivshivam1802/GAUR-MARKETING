import { redirect } from "next/navigation"
import { ensureLinksTable, sql } from "@/lib/neon"

type LinkRow = { target_url: string }

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params

  try {
    await ensureLinksTable()
    const rows = (await sql`
      UPDATE links
      SET visits = visits + 1
      WHERE code = ${code}
      RETURNING target_url
    `) as LinkRow[]

    if (rows[0]?.target_url) redirect(rows[0].target_url)
  } catch (error) {
    console.error("Failed to forward tracked link:", error)
  }

  redirect("/?error=invalid_url")
}
