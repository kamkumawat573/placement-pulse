import { Cashfree, CFEnvironment } from "cashfree-pg"

let cashfreeInstance: Cashfree | null = null

export function getCashfree(): Cashfree {
  if (!cashfreeInstance) {
    const appId = process.env.NEXT_PUBLIC_CASHFREE_APP_ID
    const secretKey = process.env.CASHFREE_SECRET_KEY
    const environment = process.env.CASHFREE_ENVIRONMENT || "sandbox"

    if (!appId || !secretKey) {
      throw new Error("Missing CashFree credentials. Please set NEXT_PUBLIC_CASHFREE_APP_ID and CASHFREE_SECRET_KEY environment variables.")
    }

    // Initialize CashFree singleton
    cashfreeInstance = new Cashfree(
      environment === "production" ? CFEnvironment.PRODUCTION : CFEnvironment.SANDBOX,
      appId,
      secretKey
    )
  }

  return cashfreeInstance
}
