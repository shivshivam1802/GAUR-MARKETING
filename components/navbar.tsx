"use client";

import Link from "next/link";
import { Link2, Sparkles, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { PaymentModal } from "./payment-modal";

export function Navbar() {
  const [isPremium, setIsPremium] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkPremium = () => {
      if (typeof window !== "undefined") {
        const active = localStorage.getItem("gaur_premium_active") === "true";
        setIsPremium(active);
      }
    };

    checkPremium();

    // Poll to keep premium status reactive
    const interval = setInterval(checkPremium, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-200">
              <Link2 className="w-5.5 h-5.5 rotate-45" />
            </div>
            <div>
              <div className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 leading-none">
                GAUR <span className="text-indigo-400">LINKS</span>
              </div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-widest leading-none font-semibold">Dynamic Redirector</span>
            </div>
          </Link>

          <div className="flex items-center space-x-3">
            {/* Admin Panel Link */}
            <Link 
              href="/admin/payments" 
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all duration-200"
            >
              <Shield className="w-3.5 h-3.5 text-red-500" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden">Admin</span>
            </Link>

            {isPremium ? (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-xs text-amber-400 font-bold shadow-lg shadow-amber-500/5 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/40" />
                PREMIUM ACTIVE
              </div>
            ) : (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-bold transition-all duration-300 shadow-md shadow-indigo-600/20 hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Unlock Premium
              </button>
            )}

            <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
              v1.0.0 Stable
            </div>
          </div>
        </div>
      </div>

      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
}
