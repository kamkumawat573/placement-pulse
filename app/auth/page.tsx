"use client"


import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { useAuth } from "@/contexts/auth-context"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Check if we should default to signup mode
    const mode = searchParams.get('mode')
    if (mode === 'signup') {
      setIsLogin(false)
    }
  }, [searchParams])

  const handleSuccess = () => {
    const saved = (() => {
      try {
        return JSON.parse(localStorage.getItem("user") || "null")
      } catch {
        return null
      }
    })()
    const u = saved || user
    if (u?.enrolledCourse) {
      router.push("/dashboard")
    } else {
      router.push("/enroll")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 pt-20 lg:pt-24">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} onSuccess={handleSuccess} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  )
}
