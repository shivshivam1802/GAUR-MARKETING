"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  ShieldAlert,
  Copy,
  ExternalLink,
  RefreshCw,
  Search,
  Lock,
  User as UserIcon,
  Mail,
  Loader2,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster } from "@/components/ui/sonner"

interface PaymentItem {
  id: string
  fullName: string
  email: string
  walletAddress?: string
  transactionHash: string
  paymentStatus: "pending" | "verified" | "rejected"
  createdAt: string
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified" | "rejected">("all")
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/payments")
      if (res.ok) {
        const data = await res.json()
        setPayments(data.payments || [])
      } else {
        toast.error("Failed to load payments database")
      }
    } catch (e) {
      console.error(e)
      toast.error("Network error loading payments")
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    setActionLoadingId(userId)
    try {
      const res = await fetch("/api/admin/payments/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(data.message)
        fetchPayments()
      } else {
        toast.error(data.error || "Action failed")
      }
    } catch (e) {
      console.error(e)
      toast.error("Network error performing action")
    } finally {
      setActionLoadingId(null)
    }
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  // Filters
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.transactionHash.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || p.paymentStatus === filterStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Toaster position="top-right" theme="dark" />
      <Navbar />

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white mb-2 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Link Workspace
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-indigo-400 to-purple-400">
              Admin Payments Console
            </h1>
            <p className="text-neutral-400 text-sm">
              Review, approve, or reject user transaction hashes for premium tier validation.
            </p>
          </div>
          <Button
            onClick={fetchPayments}
            disabled={loading}
            variant="outline"
            className="border-neutral-800 text-neutral-300 hover:bg-neutral-800"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Controls Card */}
          <Card className="bg-neutral-900/60 border-neutral-800 backdrop-blur-xl">
            <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  placeholder="Search user, email, or TXID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-neutral-950 border-neutral-800 text-white pl-10 rounded-lg placeholder-neutral-600"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 w-full md:w-auto">
                {(["all", "pending", "verified", "rejected"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all border cursor-pointer ${
                      filterStatus === status
                        ? "bg-indigo-600 border-indigo-500 text-white"
                        : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                    }`}
                  >
                    {status === "verified" ? "Approved" : status}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* List Table Card */}
          <Card className="bg-neutral-900/60 border-neutral-800 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-800 bg-neutral-900/40 p-4">
              <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-300">
                <Lock className="w-4 h-4 text-indigo-500" /> Payment Receipts list
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-neutral-500">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                  <p className="text-sm">Loading users from backend database...</p>
                </div>
              ) : filteredPayments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-neutral-800 bg-neutral-950/40 text-neutral-400 text-xs font-semibold uppercase">
                        <th className="py-4 px-6">User Profile</th>
                        <th className="py-4 px-6">Transaction ID (TXID)</th>
                        <th className="py-4 px-6">Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {filteredPayments.map((item) => (
                        <tr key={item.id} className="hover:bg-neutral-900/20 group">
                          {/* User Profile */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase">
                                {item.fullName.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-neutral-200 flex items-center gap-1">
                                  {item.fullName}
                                </div>
                                <div className="text-xs text-neutral-500 flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> {item.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* TxID */}
                          <td className="py-4 px-6 font-mono text-xs">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-indigo-300 select-all truncate max-w-[180px] md:max-w-[280px]">
                                  {item.transactionHash}
                                </span>
                                <button
                                  onClick={() => handleCopy(item.transactionHash, "Transaction Hash")}
                                  className="text-neutral-500 hover:text-white p-0.5"
                                  title="Copy TXID"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <a
                                  href={`https://tronscan.org/#/transaction/${item.transactionHash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neutral-500 hover:text-indigo-400 p-0.5"
                                  title="Check on TronScan"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              </div>
                              {item.walletAddress && (
                                <div className="text-[10px] text-neutral-500 truncate max-w-[220px]">
                                  Sender: {item.walletAddress}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6">
                            {item.paymentStatus === "pending" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-bold">
                                Pending
                              </span>
                            )}
                            {item.paymentStatus === "verified" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold">
                                <ShieldCheck className="w-3.5 h-3.5" /> Approved
                              </span>
                            )}
                            {item.paymentStatus === "rejected" && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold">
                                <ShieldAlert className="w-3.5 h-3.5" /> Rejected
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            {item.paymentStatus === "pending" ? (
                              <div className="flex items-center justify-end gap-2">
                                <Button
                                  onClick={() => handleAction(item.id, "approve")}
                                  disabled={actionLoadingId === item.id}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-500 text-white font-bold h-8 rounded-lg cursor-pointer"
                                >
                                  {actionLoadingId === item.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Check className="w-3.5 h-3.5 mr-1" />
                                  )}
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleAction(item.id, "reject")}
                                  disabled={actionLoadingId === item.id}
                                  size="sm"
                                  className="bg-red-600 hover:bg-red-500 text-white font-bold h-8 rounded-lg cursor-pointer"
                                >
                                  {actionLoadingId === item.id ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <XCircle className="w-3.5 h-3.5 mr-1" />
                                  )}
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-neutral-500 font-medium">Reviewed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-600">
                    <UserIcon className="w-8 h-8" />
                  </div>
                  <div className="max-w-xs mx-auto">
                    <h4 className="font-bold text-neutral-300 mb-1">No Payments Found</h4>
                    <p className="text-neutral-500 text-sm">
                      {searchQuery ? "No payment receipts matches the search query." : "Pending user registrations will list here."}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
