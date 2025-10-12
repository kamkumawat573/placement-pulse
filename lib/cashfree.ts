import { Cashfree, CFEnvironment } from 'cashfree-pg'

let instance: Cashfree | null = null

export function getCashfree(): Cashfree {
  if (instance) return instance

  const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID
  const secretKey = process.env.CASHFREE_SECRET_KEY
  const environment = process.env.CASHFREE_ENVIRONMENT || 'sandbox'

  if (!appId || !secretKey) {
    throw new Error('Missing CashFree credentials')
  }

  instance = new Cashfree(
    environment === 'production' ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
    appId,
    secretKey
  )

  return instance
}

export function resetCashfreeForTests() {
  // Helper to reset the singleton in tests if needed
  instance = null
}
