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
    return <div>Loading...</div>
  }

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
