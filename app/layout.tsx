import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Placement Pulse - MBA Placement Preparation",
  description: "Master your MBA placements and internships with Placement Pulse. Get expert guidance, mock interviews, GD practice, and placement strategy from MBA alumni.",
  generator: "Placement Pulse",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>{children}</AuthProvider>
        </Suspense>
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  )
}
