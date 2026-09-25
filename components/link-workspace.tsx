"use client"

import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Copy, ExternalLink, Link2, MessageCircle, RefreshCw, ScrollText } from "lucide-react"
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react"

type Mode = "forwarder" | "whatsapp" | "redirect"
type LinkRecord = { code: string; target_url: string; visits: number; created_at?: string }
type LinkPage = { links: LinkRecord[]; hasMore: boolean }

export function LinkWorkspace() {
  const [mode, setMode] = useState<Mode>("forwarder")
  const [targetUrl, setTargetUrl] = useState("")
  const [alias, setAlias] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [result, setResult] = useState<LinkRecord | null>(null)
  const [links, setLinks] = useState<LinkRecord[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [origin, setOrigin] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const sentinel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
    loadLinks(1)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) loadLinks(page + 1)
    }, { rootMargin: "240px" })
    if (sentinel.current) observer.observe(sentinel.current)
    return () => observer.disconnect()
  }, [hasMore, loadingMore, page])

  const loadLinks = async (nextPage: number) => {
    setLoadingMore(true)
    try {
      const response = await fetch(`/api/links?page=${nextPage}&limit=12`)
      if (!response.ok) return
      const data: LinkPage = await response.json()
      setLinks((current) => nextPage === 1 ? data.links : [...current, ...data.links])
      setPage(nextPage)
      setHasMore(data.hasMore)
    } finally {
      setLoadingMore(false)
    }
  }

  const create = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError("")
    try {
      let destination = targetUrl.trim()
      if (mode === "whatsapp") {
        const cleanedPhone = phone.replace(/\D/g, "")
        if (cleanedPhone.length < 7) throw new Error("Enter a WhatsApp number with country code")
        destination = `https://wa.me/${cleanedPhone}${message ? `?text=${encodeURIComponent(message)}` : ""}`
      }
      if (!destination) throw new Error(mode === "whatsapp" ? "Enter a phone number" : "Enter a destination URL")
      const response = await fetch("/api/links", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ targetUrl: destination, alias: mode === "redirect" ? alias : "" }) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Unable to create link")
      const statsResponse = await fetch(`/api/links/${encodeURIComponent(data.code)}`)
      const created: LinkRecord = statsResponse.ok ? await statsResponse.json() : { code: data.code, target_url: destination, visits: 0 }
      setResult(created)
      await loadLinks(1)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create link")
    } finally {
      setBusy(false)
    }
  }

  const refresh = async () => {
    if (!result) return
    const response = await fetch(`/api/links/${encodeURIComponent(result.code)}`)
    if (response.ok) {
      const updated = await response.json()
      setResult(updated)
      setLinks((current) => current.map((link) => link.code === updated.code ? updated : link))
    }
  }

  const trackedUrl = result ? `${origin}/r/${encodeURIComponent(result.code)}` : ""
  const directUrl = result ? `${origin}/link?url=${encodeURIComponent(result.target_url)}` : ""
  const copy = (value: string) => navigator.clipboard.writeText(value)

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#202522]">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between border-b border-[#202522]/15 pb-5">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowLeft size={16} /> GAUR LINKS</Link>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#202522]/45">Link workspace</span>
        </header>

        <div className="grid gap-12 py-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-24">
          <section>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bd5b32]">Build and measure</p>
            <h1 className="mt-4 max-w-2xl text-5xl font-semibold leading-none tracking-[-0.055em] sm:text-6xl">Every useful link, in one ledger.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-[#202522]/60">Forward a URL, start a WhatsApp chat, or create a code-based redirect. Each generated link is stored with its visit total.</p>

            <form onSubmit={create} className="mt-10 border border-[#202522]/15 bg-[#fbfaf6] p-5 sm:p-7">
              <div className="mb-7 grid grid-cols-3 border-b border-[#202522]/15">
                <ModeButton active={mode === "forwarder"} onClick={() => setMode("forwarder")} icon={<ArrowUpRight size={15} />} label="Forwarder" />
                <ModeButton active={mode === "whatsapp"} onClick={() => setMode("whatsapp")} icon={<MessageCircle size={15} />} label="WhatsApp" />
                <ModeButton active={mode === "redirect"} onClick={() => setMode("redirect")} icon={<Link2 size={15} />} label="Code redirect" />
              </div>
              {mode === "whatsapp" ? <>
                <label className="block text-sm font-semibold">Phone number with country code<input required value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="919999999999" className="mt-2 w-full border border-[#202522]/20 bg-transparent px-3 py-3 outline-none focus:border-[#bd5b32]" /></label>
                <label className="mt-5 block text-sm font-semibold">Opening message <span className="font-normal text-[#202522]/45">optional</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} className="mt-2 w-full resize-y border border-[#202522]/20 bg-transparent px-3 py-3 outline-none focus:border-[#bd5b32]" /></label>
              </> : <label className="block text-sm font-semibold">Destination URL<input required type="url" placeholder="https://example.com/offer" value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} className="mt-2 w-full border border-[#202522]/20 bg-transparent px-3 py-3 outline-none focus:border-[#bd5b32]" /></label>}
              {mode === "redirect" && <label className="mt-5 block text-sm font-semibold">Custom code <span className="font-normal text-[#202522]/45">optional</span><div className="mt-2 flex items-center border border-[#202522]/20"><span className="px-3 text-sm text-[#202522]/40">/r/</span><input value={alias} onChange={(event) => setAlias(event.target.value)} placeholder="spring-offer" className="min-w-0 flex-1 bg-transparent px-1 py-3 outline-none" /></div></label>}
              {error && <p className="mt-4 text-sm text-[#bd5b32]">{error}</p>}
              <button disabled={busy} className="mt-6 inline-flex items-center gap-2 bg-[#202522] px-5 py-3 text-sm font-semibold text-[#f4f1ea] hover:bg-[#bd5b32] disabled:opacity-50">{busy ? "Creating..." : "Create tracked link"}<ArrowUpRight size={16} /></button>
            </form>
          </section>

          <aside className="border-l border-[#202522]/15 pl-0 lg:pl-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#202522]/45">Supported links</p>
            <dl className="mt-6 space-y-6 text-sm">
              <Info title="Forwarder" text="/link?url=... sends visitors to any HTTP or HTTPS destination." />
              <Info title="WhatsApp" text="Tracked /r/ codes open wa.me chats with an optional message." />
              <Info title="Code redirect" text="/r/[code] stores a destination and increments visits." />
            </dl>
          </aside>
        </div>

        {result && <section className="border-t border-[#202522]/15 py-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bd5b32]">Latest link</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">{result.visits.toLocaleString()} visits recorded</h2></div><button onClick={refresh} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#bd5b32]"><RefreshCw size={15} /> Refresh count</button></div><div className="mt-7 grid gap-4 md:grid-cols-3"><Result label="Tracked URL" value={trackedUrl} onCopy={() => copy(trackedUrl)} /><Result label="Direct forwarder" value={directUrl} onCopy={() => copy(directUrl)} /><div className="border border-[#202522]/15 bg-[#fbfaf6] p-5"><p className="text-xs uppercase tracking-[0.16em] text-[#202522]/45">Destination</p><p className="mt-4 break-all text-sm leading-6">{result.target_url}</p><Link href={`/stats/${encodeURIComponent(result.code)}`} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">View stats <ExternalLink size={14} /></Link></div></div></section>}

        <section className="border-t border-[#202522]/15 py-10"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bd5b32]">Link ledger</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Recent links and visits</h2></div><button onClick={() => loadLinks(1)} className="inline-flex items-center gap-2 text-sm font-semibold hover:text-[#bd5b32]"><RefreshCw size={15} /> Refresh</button></div><div className="mt-6 divide-y divide-[#202522]/15 border-y border-[#202522]/15">{links.map((link) => <LedgerRow key={link.code} link={link} origin={origin} />)}{!links.length && !loadingMore && <p className="py-8 text-sm text-[#202522]/55">No tracked links yet.</p>}</div><div ref={sentinel} className="flex justify-center py-8 text-sm text-[#202522]/50">{loadingMore ? "Loading more links..." : hasMore ? "Scroll for more" : "All links loaded"}</div></section>
      </div>
    </main>
  )
}

function ModeButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) { return <button type="button" onClick={onClick} className={`flex items-center justify-center gap-2 border-b-2 pb-3 text-sm font-semibold ${active ? "border-[#bd5b32]" : "border-transparent text-[#202522]/45"}`}>{icon}{label}</button> }
function Info({ title, text }: { title: string; text: string }) { return <div><dt className="font-semibold">{title}</dt><dd className="mt-1 leading-6 text-[#202522]/55">{text}</dd></div> }
function Result({ label, value, onCopy }: { label: string; value: string; onCopy: () => void }) { return <div className="border border-[#202522]/15 bg-[#fbfaf6] p-5"><p className="text-xs uppercase tracking-[0.16em] text-[#202522]/45">{label}</p><p className="mt-4 break-all text-sm leading-6">{value}</p><button type="button" onClick={onCopy} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:text-[#bd5b32]"><Copy size={14} /> Copy</button></div> }
function LedgerRow({ link, origin }: { link: LinkRecord; origin: string }) { const isWhatsApp = link.target_url.includes("wa.me/"); const type = isWhatsApp ? "WhatsApp" : link.code.startsWith("link_") ? "Forwarder" : "Code redirect"; return <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#bd5b32]"><ScrollText size={14} /> {type}</div><p className="mt-2 truncate text-sm font-semibold">{origin}/r/{link.code}</p><p className="mt-1 truncate text-sm text-[#202522]/50">{link.target_url}</p></div><div className="flex items-center gap-5"><div><p className="text-xs uppercase tracking-[0.16em] text-[#202522]/45">Visits</p><p className="mt-1 text-2xl font-semibold">{link.visits.toLocaleString()}</p></div><Link href={`/stats/${encodeURIComponent(link.code)}`} aria-label={`View stats for ${link.code}`} className="text-[#202522]/60 hover:text-[#bd5b32]"><ExternalLink size={18} /></Link></div></div> }
