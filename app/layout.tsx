import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import "./globals.css"

export const metadata: Metadata = {
  title: "LeasifAI - Your Gateway to Commercial Leasing",
  description:
    "AI-powered commercial real estate leasing platform connecting property owners with MSMEs for seamless, smart, and efficient lease management.",
  generator: "v0.app",
  keywords: [
    "commercial real estate",
    "leasing",
    "AI",
    "property management",
    "feasibility study",
    "MSME",
    "landlord",
    "tenant",
  ],
  authors: [{ name: "LeasifAI Team" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LeasifAI",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<LoadingScreen message="Initializing LeasifAI..." />}>
          <div className="mobile-container">{children}</div>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
