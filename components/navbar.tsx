"use client";

import Link from "next/link";
import { Link2, Sparkles } from "lucide-react";

export function Navbar() {
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

          <div className="flex items-center space-x-4">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-400">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              v1.0.0 Stable
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
