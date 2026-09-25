import { notFound } from "next/navigation"
import { ensureLinksTable, sql } from "@/lib/neon"

type LinkStats = {
  code: string
  target_url: string
  visits: number
}

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  await ensureLinksTable()
  const rows = (await sql`
    SELECT code, target_url, visits
    FROM links
    WHERE code = ${code}
  `) as LinkStats[]

  const link = rows[0]
  if (!link) notFound()

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-20 text-neutral-100">
      <section className="mx-auto max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Link analytics</p>
        <h1 className="mt-3 text-3xl font-bold">Total visits</h1>
        <p className="mt-2 break-all text-sm text-neutral-400">{link.target_url}</p>
        <p className="mt-10 text-7xl font-bold text-white">{link.visits.toLocaleString()}</p>
        <p className="mt-2 text-neutral-400">visits recorded for /r/{link.code}</p>
      </section>
    </main>
  )
}