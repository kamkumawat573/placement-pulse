'use client'

import { useEffect, useState } from 'react'

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('Initializing...')

  useEffect(() => {
    const loadingTexts = [
      'Initializing...',
      'Loading Placement Pulse...',
      'Preparing your MBA journey...',
      'Setting up expert guidance...',
      'Almost ready...'
    ]

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingTexts.indexOf(prev)
        return loadingTexts[(currentIndex + 1) % loadingTexts.length]
      })
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(textInterval)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* Logo/Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PP
              </span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Placement Pulse
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            MBA Placement Preparation Platform
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {loadingText}
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-1 mb-6">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>

        {/* Features Preview */}
        <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
          <div className="flex items-center justify-center space-x-2">
            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
            <span>Mock Interviews & GD Practice</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
            <span>Expert Mentorship</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
            <span>Placement Strategy</span>
          </div>
        </div>
      </div>
    </div>
  )
}
