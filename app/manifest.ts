import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GAUR LINKS",
    short_name: "GAUR LINKS",
    description:
      "GAUR LINKS is a powerful smart link generator that lets users create WhatsApp direct chat links, dynamic redirects, UTM campaign URLs, QR codes, and shareable smart links instantly.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#4f46e5",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/icon-dark-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  }
}
