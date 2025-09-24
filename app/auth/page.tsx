"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { SignupForm } from "@/components/auth/signup-form"
import { useAuth } from "@/contexts/auth-context"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const router = useRouter()
  const { user } = useAuth()

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
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
