'use client'

import { AuthProvider } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until mounted on client
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Placement Pulse</h2>
          <p className="text-muted-foreground">Initializing your session...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
