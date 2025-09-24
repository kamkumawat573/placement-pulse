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

interface LoginFormProps {
  onToggleMode: () => void
  onSuccess: () => void
}

export function LoginForm({ onToggleMode, onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const { login, loading } = useAuth()
  const recaptchaRef = useRef<ReCaptchaRef>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA verification.")
      return
    }

    try {
      // First try admin login
      const adminResponse = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, recaptchaToken }),
      });

      if (adminResponse.ok) {
        // Admin login successful, redirect to admin panel
        window.location.href = '/admin';
        return;
      }

      // If admin login fails, try regular user login
      const success = await login(email, password, recaptchaToken)
      if (success) {
        onSuccess()
      } else {
        setError("Invalid credentials. Try student@example.com with any password.")
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("An error occurred during login. Please try again.")
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
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to access your course</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <button onClick={onToggleMode} className="text-accent hover:underline font-medium">
            Sign up
          </button>
        </div>
        <div className="mt-4 p-3 bg-muted rounded-md text-sm text-muted-foreground">
          <strong>Demo credentials:</strong>
          <br />
          Email: student@example.com
          <br />
          Password: any password
        </div>
      </CardContent>
    </Card>
  )
}
