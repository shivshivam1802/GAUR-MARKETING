"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Page() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.code as string;
    if (!code) return;

    // 1. Check custom aliases in localStorage
    const savedAliases = localStorage.getItem("gaur_link_aliases");
    if (savedAliases) {
      try {
        const aliases = JSON.parse(savedAliases);
        if (aliases[code]) {
          const target = aliases[code];
          window.location.href = target;
          return;
        }
      } catch (e) {
        console.error("Failed to parse custom aliases:", e);
      }
    }

    // 2. Decode from Base64
    try {
      const decodedUrl = atob(code);
      if (decodedUrl.startsWith("http://") || decodedUrl.startsWith("https://")) {
        new URL(decodedUrl); // Verify it's a valid URL format
        window.location.href = decodedUrl;
      } else {
        throw new Error("Invalid protocol");
      }
    } catch (e) {
      router.push("/?error=invalid_url");
    }
  }, [params.code, router]);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        <p className="text-neutral-400 text-sm">Redirecting securely...</p>
      </div>
    </div>
  );
}
