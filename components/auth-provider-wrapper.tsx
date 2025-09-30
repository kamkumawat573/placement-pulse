'use client'

import { AuthProvider } from '@/contexts/auth-context'
import { useEffect, useState } from 'react'

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Render children immediately to prevent loading issues
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
