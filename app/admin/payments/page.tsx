"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Check, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  Copy, 
  ExternalLink,
  Sparkles,
  RefreshCw,
  Search,
  DollarSign
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

interface PaymentItem {
  id: string;
  txHash: string;
  senderWallet?: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  timestamp: string;
  price: string;
  network: string;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [isPremiumActive, setIsPremiumActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    loadData();
  }, []);

  const loadData = () => {
    if (typeof window !== "undefined") {
      // Load Payments
      const saved = localStorage.getItem("gaur_premium_payments");
      if (saved) {
        try {
          setPayments(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
      
      // Load Active Premium state
      const active = localStorage.getItem("gaur_premium_active") === "true";
      setIsPremiumActive(active);
    }
  };

  const handleToggleMasterPremium = () => {
    const nextState = !isPremiumActive;
    localStorage.setItem("gaur_premium_active", String(nextState));
    setIsPremiumActive(nextState);
    toast.success(
      nextState 
        ? "Master Premium Enabled! Workspace features unlocked." 
        : "Master Premium Disabled! Capping history logs and aliases."
    );
  };

  const handleApprovePayment = (id: string, email: string) => {
    const updated = payments.map((p) => {
      if (p.id === id) {
        return { ...p, status: "approved" as const };
      }
      return p;
    });

    setPayments(updated);
    localStorage.setItem("gaur_premium_payments", JSON.stringify(updated));
    
    // Activate premium for the browser session
    localStorage.setItem("gaur_premium_active", "true");
    setIsPremiumActive(true);

    toast.success(`Payment verified and approved! Premium activated for ${email}`);
  };

  const handleDeletePayment = (id: string) => {
    if (confirm("Are you sure you want to delete this payment record?")) {
      const updated = payments.filter((p) => p.id !== id);
      setPayments(updated);
      localStorage.setItem("gaur_premium_payments", JSON.stringify(updated));
      toast.success("Payment record deleted.");
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleResetStorage = () => {
    if (confirm("DANGER: This will delete ALL submitted payment records and disable Premium status. Proceed?")) {
      localStorage.removeItem("gaur_premium_payments");
      localStorage.setItem("gaur_premium_active", "false");
      setPayments([]);
      setIsPremiumActive(false);
      toast.success("Payments database and Premium settings reset.");
    }
  };

  // Filter lists
  const filteredPayments = payments.filter((p) => 
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.senderWallet && p.senderWallet.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />

      <div className="container mx-auto px-4 pt-32 pb-16 max-w-6xl">
        {/* Header Navigation */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Link Workspace
          </Link>
        </div>

        {/* Admin Dashboard Title & Master Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-neutral-900 pb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-indigo-400 flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-red-500" /> Admin Payment Review
            </h1>
            <p className="text-neutral-400 text-sm mt-1">
              Verify TRC20 USDT payments, activate premium licenses, and review logs securely.
            </p>
          </div>

          {/* Master Control Card */}
          <div className="flex flex-wrap items-center gap-4 bg-neutral-900/60 border border-neutral-800 p-4 rounded-xl backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <Sparkles className={`w-4 h-4 ${isPremiumActive ? "text-amber-400 animate-spin" : "text-neutral-500"}`} />
              <span className="text-xs font-semibold text-neutral-300">Master Premium Mode:</span>
              <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                isPremiumActive 
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                  : "bg-neutral-850 text-neutral-500 border border-neutral-850"
              }`}>
                {isPremiumActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>
            <button 
              onClick={handleToggleMasterPremium}
              className={`text-xs font-bold px-4 py-2 rounded-lg cursor-pointer transition-all ${
                isPremiumActive 
                  ? "bg-amber-600 hover:bg-amber-500 text-white" 
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/10"
              }`}
            >
              Toggle Premium
            </button>
            <button 
              onClick={handleResetStorage}
              className="text-xs font-bold px-3 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 cursor-pointer"
            >
              Reset Database
            </button>
          </div>
        </div>

        {/* Database List Workspace */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-neutral-200">
              <DollarSign className="w-5 h-5 text-indigo-400" /> Submitted Tx Receipts ({payments.length})
            </h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input 
                  placeholder="Search emails, tx hashes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white pl-9 py-2 rounded-lg text-xs focus:ring-indigo-500 focus:outline-none placeholder-neutral-600 font-sans"
                />
              </div>
              <button 
                onClick={loadData}
                className="p-2 border border-neutral-800 hover:border-neutral-700 bg-neutral-900 rounded-lg text-neutral-400 hover:text-white transition-colors"
                title="Refresh Records List"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Glassmorphic Table Container */}
          <div className="overflow-x-auto rounded-xl border border-neutral-850 bg-neutral-900/40 backdrop-blur-xl shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/40 text-neutral-400 text-xs font-bold tracking-wider uppercase">
                  <th className="p-4">Submission Date</th>
                  <th className="p-4">User Details</th>
                  <th className="p-4">TRON Tx Hash (TXID)</th>
                  <th className="p-4">Payment Info</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-neutral-850">
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-900/20 transition-colors group">
                      {/* Submission Date */}
                      <td className="p-4 whitespace-nowrap text-xs text-neutral-400 font-mono">
                        {item.timestamp}
                      </td>

                      {/* User Details */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-bold text-neutral-200">{item.email}</div>
                          {item.senderWallet ? (
                            <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                              <span>Sender: {item.senderWallet.slice(0, 8)}...{item.senderWallet.slice(-8)}</span>
                              <button 
                                onClick={() => handleCopy(item.senderWallet || "", "Sender Wallet")}
                                className="opacity-0 group-hover:opacity-100 hover:text-neutral-300 p-0.5 bg-transparent transition-opacity"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-neutral-600">No sender address provided</span>
                          )}
                        </div>
                      </td>

                      {/* TRON Tx Hash */}
                      <td className="p-4 max-w-xs truncate font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-indigo-400 select-all truncate">{item.txHash}</span>
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleCopy(item.txHash, "Tx Hash")}
                              className="text-neutral-500 hover:text-white p-1"
                              title="Copy Hash"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => window.open(`https://tronscan.org/#/transaction/${item.txHash}`, "_blank")}
                              className="text-neutral-500 hover:text-white p-1"
                              title="Verify on TronScan Explorer"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Payment Info */}
                      <td className="p-4 whitespace-nowrap">
                        <div className="space-y-0.5 text-xs">
                          <span className="font-extrabold text-indigo-300">{item.price}</span>
                          <span className="block text-[10px] text-neutral-500 uppercase font-semibold">{item.network}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          item.status === "approved"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : item.status === "rejected"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        }`}>
                          {item.status === "approved" && <Check className="w-3 h-3" />}
                          {item.status === "rejected" && <ShieldAlert className="w-3 h-3" />}
                          {item.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end gap-2">
                          {item.status === "pending" && (
                            <button
                              onClick={() => handleApprovePayment(item.id, item.email)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold cursor-pointer transition-colors"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePayment(item.id)}
                            className="p-2 border border-neutral-850 hover:border-red-500/20 hover:text-red-400 rounded-lg text-neutral-500 transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-neutral-500">
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-full bg-neutral-950 border border-neutral-850 flex items-center justify-center mx-auto text-neutral-700">
                          <DollarSign className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-neutral-400">No payment receipts found</h4>
                        <p className="text-xs text-neutral-600 max-w-xs mx-auto">
                          {searchQuery ? "No receipts match your search filter." : "Proof of payments submitted via checkout will appear here for verification."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
