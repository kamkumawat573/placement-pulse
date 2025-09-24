"use client"

import React, { useRef, forwardRef, useImperativeHandle } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

interface ReCaptchaProps {
  siteKey: string
  onVerify: (token: string | null) => void
  onExpire?: () => void
  onError?: () => void
  theme?: 'light' | 'dark'
  size?: 'compact' | 'normal' | 'invisible'
}

export interface ReCaptchaRef {
  reset: () => void
  execute: () => void
}

export const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(
  ({ siteKey, onVerify, onExpire, onError, theme = 'light', size = 'normal' }, ref) => {
    const recaptchaRef = useRef<ReCAPTCHA>(null)

    useImperativeHandle(ref, () => ({
      reset: () => {
        recaptchaRef.current?.reset()
      },
      execute: () => {
        recaptchaRef.current?.execute()
      }
    }))

    return (
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={onVerify}
        onExpired={onExpire}
        onErrored={onError}
        theme={theme}
        size={size}
      />
    )
  }
)

ReCaptcha.displayName = 'ReCaptcha'
