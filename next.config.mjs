/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Production optimizations
  // output: 'standalone', // Disabled for compatibility with next start
  trailingSlash: false,
  // Enable static optimization where possible
  experimental: {
    // optimizeCss: true, // Disabled due to critters dependency issue
  },
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  env: {
    // Pass through APP_ENV for application logic
    APP_ENV: process.env.APP_ENV,
    // Other environment variables
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
  },
}

export default nextConfig