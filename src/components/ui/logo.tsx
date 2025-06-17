import React from 'react'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-10 w-10'
  }
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-3/4 h-3/4"
        >
          {/* W shape */}
          <path d="M4 4L8 20L12 12L16 20L20 4" />
          {/* Dot for .krd */}
          <circle cx="21" cy="6" r="1" fill="currentColor" />
        </svg>
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-gray-900`}>
          Works<span className="text-blue-600">.krd</span>
        </span>
      )}
    </div>
  )
}