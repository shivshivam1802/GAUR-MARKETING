import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "GAUR LINKS – Dynamic Redirector, Smart Redirect & UTM Builder",
  description:
    "GAUR LINKS is a powerful smart link generator that lets users create WhatsApp direct chat links, dynamic redirects, UTM campaign URLs, QR codes, and shareable smart links instantly.",
  keywords:
    "GAUR LINKS, Dynamic Redirector, Smart Redirect, WhatsApp Link Generator, UTM Builder, QR Code Generator, Smart Links, URL Shortener, Marketing Tools",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "GAUR LINKS – Dynamic Redirector & Smart Link Generator",
    description: "Generate WhatsApp links, smart redirects, UTM URLs, and QR codes instantly.",
    siteName: "GAUR LINKS",
    url: "https://gaurmarketing.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GAUR LINKS – Dynamic Redirector",
    description: "Build WhatsApp links, Smart Redirects, and UTM Campaign URLs in seconds.",
  },
  applicationName: "GAUR LINKS",
  generator: 'v0.app'
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "GAUR LINKS",
  "alternateName": "GAUR LINKS Dynamic Redirector",
  "url": "https://gaurmarketing.com",
  "description": "GAUR LINKS is a powerful smart link generator that lets users create WhatsApp direct chat links, dynamic redirects, UTM campaign URLs, QR codes, and shareable smart links instantly.",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0.00",
    "priceCurrency": "USD"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
