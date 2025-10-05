"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  mobile?: string
  enrolledCourse?: boolean
  enrolledCourses?: Array<{
    courseId: string
    enrolledAt: string
    progress: number
    transactionId?: string
    paymentId?: string
    orderId?: string
    status: string
  }>
  progress?: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, recaptchaToken?: string) => Promise<boolean>
  signup: (
    email: string,
    password: string,
    name: string,
    mobile?: string,
    recaptchaToken?: string,
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const initializeAuth = async () => {
      // Check if we're in browser environment
      if (typeof window === 'undefined') {
        setLoading(false)
        return
      }

      // First, try to get user from localStorage for instant UI
      const cachedUser = localStorage.getItem("user")
      if (cachedUser) {
        try {
          const parsedUser = JSON.parse(cachedUser)
          setUser(parsedUser)
          setLoading(false)
        } catch {
          localStorage.removeItem("user")
        }
      }

      // Then verify with server in background
      try {
        const res = await fetch("/api/auth/me", { 
          cache: "no-store",
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        const data = await res.json()
        if (data?.user) {
          setUser(data.user)
          localStorage.setItem("user", JSON.stringify(data.user))
        } else {
          setUser(null)
          localStorage.removeItem("user")
        }
      } catch (error) {
        // If server call fails, keep cached user if available
        console.warn("Auth verification failed:", error)
        if (!cachedUser) {
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }
    
    initializeAuth()
  }, [])

  const login = async (email: string, password: string, recaptchaToken?: string): Promise<boolean> => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, recaptchaToken }),
      })
      if (!res.ok) return false
      const userData = await res.json()
      setUser(userData)
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(userData))
      }
      return true
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    mobile?: string,
    recaptchaToken?: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, mobile, recaptchaToken }),
      })
      if (!res.ok) {
        try {
          const data = await res.json()
          return { success: false, error: data?.error || "Signup failed" }
        } catch {
          return { success: false, error: "Signup failed" }
        }
      }
      const userData = await res.json()
      setUser(userData)
      if (typeof window !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(userData))
      }
      return { success: true }
    } catch {
      return { success: false, error: "Network error" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } finally {
      setUser(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem("user")
      }
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <AuthContext.Provider value={{ user: null, login, signup, logout, loading: true }}>{children}</AuthContext.Provider>
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    // Return a default context during SSR or when not in AuthProvider
    return {
      user: null,
      login: async () => false,
      signup: async () => ({ success: false, error: 'Not available' }),
      logout: async () => {},
      loading: true
    }
  }
  return context
}
