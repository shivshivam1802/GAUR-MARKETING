"use client"

import Link from "next/link"
import { ArrowRight, Check, Copy, LogIn, UserPlus, Wallet } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"

export function AuthHome() {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [copiedWallet, setCopiedWallet] = useState(false)
  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    password: "",
    transactionHash: "",
    walletAddress: "",
  })

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  const updateField = (name: string, value: string) => setFields((current) => ({ ...current, [name]: value }))
  const walletAddress = "0xe36D9ff22151d880fAAf5588040d93E577592909"
  const walletQr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(walletAddress)}`

  const copyWallet = async () => {
    await navigator.clipboard.writeText(walletAddress)
    setCopiedWallet(true)
    window.setTimeout(() => setCopiedWallet(false), 1800)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register"
    const body = mode === "login"
      ? { email: fields.email, password: fields.password }
      : fields

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Something went wrong")
      setMessage(mode === "login" ? "Signed in. Open the builder when you are ready." : "Account created. You can sign in once payment is reviewed.")
      if (mode === "login") setUser(data.user)
      else setMode("login")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f1ea] text-[#202522]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between border-b border-[#202522]/15 pb-5">
          <Link href="/" className="flex items-center gap-3 font-semibold tracking-tight">
            <img src="/icon.svg" alt="" className="size-9 rounded-lg" />
            <span>GAUR LINKS</span>
          </Link>
          <Link href="/generate" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
            Open builder <ArrowRight size={15} />
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-12 py-14 lg:grid-cols-[1fr_380px] lg:gap-24">
          <section className="max-w-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-[#bd5b32]">Simple link intelligence</p>
            <h1 className="max-w-lg text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl">Make a link. Know when it moves.</h1>
            <p className="mt-7 max-w-md text-lg leading-8 text-[#202522]/65">Build direct forwarding links, share them anywhere, and see every visit in one quiet workspace.</p>
            <div className="mt-9 flex flex-wrap gap-3 text-sm text-[#202522]/65">
              <span className="border border-[#202522]/15 px-3 py-2">Direct redirects</span>
              <span className="border border-[#202522]/15 px-3 py-2">Visit counts</span>
              <span className="border border-[#202522]/15 px-3 py-2">Neon-backed</span>
            </div>
          </section>

          <section className="border border-[#202522]/15 bg-[#fbfaf6] p-6 shadow-[8px_8px_0_#202522] sm:p-8">
            {user ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#bd5b32]">Welcome back</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight">{user.fullName || user.email}</h2>
                <p className="mt-3 text-sm leading-6 text-[#202522]/60">Your workspace is ready. Create a tracked link and keep its stats close.</p>
                <Link href="/generate" className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-[#202522] px-4 py-3 text-sm font-semibold text-[#f4f1ea] hover:bg-[#bd5b32]">
                  Go to builder <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-7 flex border-b border-[#202522]/15">
                  <button type="button" onClick={() => setMode("login")} className={`flex-1 border-b-2 pb-3 text-sm font-semibold ${mode === "login" ? "border-[#bd5b32]" : "border-transparent text-[#202522]/45"}`}><LogIn className="mr-2 inline" size={15} />Sign in</button>
                  <button type="button" onClick={() => setMode("register")} className={`flex-1 border-b-2 pb-3 text-sm font-semibold ${mode === "register" ? "border-[#bd5b32]" : "border-transparent text-[#202522]/45"}`}><UserPlus className="mr-2 inline" size={15} />Register</button>
                </div>
                <form onSubmit={submit} className="space-y-4">
                  {mode === "register" && <Field label="Name" value={fields.fullName} onChange={(value) => updateField("fullName", value)} />}
                  <Field label="Email" type="email" value={fields.email} onChange={(value) => updateField("email", value)} />
                  <Field label="Password" type="password" value={fields.password} onChange={(value) => updateField("password", value)} />
                  {mode === "register" && <>
                    <div className="border border-[#bd5b32]/35 bg-[#bd5b32]/5 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#bd5b32]"><Wallet size={14} /> Web3 access</p>
                          <p className="mt-2 text-sm font-semibold">Send 10 USDT on TRON (TRC20)</p>
                          <p className="mt-1 text-xs leading-5 text-[#202522]/55">Submit the transaction hash below for account review.</p>
                        </div>
                        <img src={walletQr} alt="USDT wallet QR code" className="size-16 bg-white p-1" />
                      </div>
                      <button type="button" onClick={copyWallet} className="mt-4 flex w-full items-center gap-2 border border-[#202522]/15 bg-[#fbfaf6] px-3 py-2 text-left text-xs font-mono hover:border-[#bd5b32]"><span className="min-w-0 flex-1 truncate">{walletAddress}</span>{copiedWallet ? <Check size={14} /> : <Copy size={14} />}</button>
                    </div>
                    <Field label="Transaction hash" value={fields.transactionHash} onChange={(value) => updateField("transactionHash", value)} />
                    <Field label="Wallet address (optional)" value={fields.walletAddress} onChange={(value) => updateField("walletAddress", value)} />
                  </>}
                  {message && <p className="text-sm leading-5 text-[#bd5b32]">{message}</p>}
                  <button disabled={loading} className="flex w-full items-center justify-center gap-2 bg-[#202522] px-4 py-3 text-sm font-semibold text-[#f4f1ea] hover:bg-[#bd5b32] disabled:opacity-50">{loading ? "Working..." : mode === "login" ? "Sign in" : "Create account"}<ArrowRight size={16} /></button>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="block text-sm font-medium">{label}<input required={label !== "Wallet address (optional)"} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block w-full border border-[#202522]/20 bg-transparent px-3 py-2.5 outline-none focus:border-[#bd5b32]" /></label>
}
