"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import { ReCaptcha, ReCaptchaRef } from "@/components/ui/recaptcha"

interface SignupFormProps {
  onToggleMode: () => void
  onSuccess: () => void
}

export function SignupForm({ onToggleMode, onSuccess }: SignupFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [error, setError] = useState("")
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const { signup, loading } = useAuth()
  const recaptchaRef = useRef<ReCaptchaRef>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification.")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    const result = await signup(email, password, name, mobile, recaptchaToken)
    if (result.success) {
      onSuccess()
    } else {
      if (result.error?.includes("Email already in use") || result.error?.includes("Mobile already in use")) {
        setError("Account already exists. Please sign in.")
      } else {
        setError(result.error || "Failed to create account. Please try again.")
      }
    }
  }

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
    if (error && token) {
      setError("")
    }
  }

  const handleRecaptchaExpire = () => {
    setRecaptchaToken(null)
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>Join us to start learning</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-center">
            <ReCaptcha
              ref={recaptchaRef}
              siteKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
              onVerify={handleRecaptchaChange}
              onExpire={handleRecaptchaExpire}
              theme="light"
              size="normal"
            />
          </div>
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading || !recaptchaToken}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <button onClick={onToggleMode} className="text-accent hover:underline font-medium">
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
