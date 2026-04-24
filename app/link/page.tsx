"use client";

import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("url");

    if (url) {
      window.location.href = url;
    }
  }, []);

  return <div>Redirecting...</div>;
}
