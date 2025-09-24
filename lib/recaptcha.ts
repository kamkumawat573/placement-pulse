export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token) {
    return false
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY
  if (!secretKey) {
    console.warn('RECAPTCHA_SECRET_KEY not configured, skipping verification')
    return true // Allow in development
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return false
  }
}
