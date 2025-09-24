"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  email: string
  name: string
  mobile?: string
  enrolledCourse?: boolean
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

  useEffect(() => {
    const initializeAuth = async () => {
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
      localStorage.setItem("user", JSON.stringify(userData))
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
      localStorage.setItem("user", JSON.stringify(userData))
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
      localStorage.removeItem("user")
    }
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
