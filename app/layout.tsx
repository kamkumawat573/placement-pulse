import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProviderWrapper } from "@/components/auth-provider-wrapper"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { Navigation } from "@/components/navigation"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export const metadata: Metadata = {
  title: "Placement Pulse - MBA Placement Preparation",
  description: "Master your MBA placements and internships with Placement Pulse. Get expert guidance, mock interviews, GD practice, and placement strategy from MBA alumni.",
  generator: "Placement Pulse",
}

// Disable static generation to prevent SSR issues with AuthProvider
export const dynamic = 'force-dynamic'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading Placement Pulse...</p>
            </div>
          </div>
        }>
          <AuthProviderWrapper>
            <Navigation />
            {children}
          </AuthProviderWrapper>
        </Suspense>
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  )
}
