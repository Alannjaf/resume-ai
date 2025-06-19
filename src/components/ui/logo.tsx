import React from 'react'
import Image from 'next/image'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const iconSizes = {
    sm: 24,
    md: 32, 
    lg: 40
  }
  
  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center justify-center">
        <Image
          src="/logo-icon.svg"
          alt="Work.krd Logo"
          width={iconSizes[size]}
          height={iconSizes[size]}
          className="object-contain"
        />
      </div>
      {showText && (
        <span className={`${textSizes[size]} font-bold text-gray-900`}>
          Work<span className="text-blue-600">.krd</span>
        </span>
      )}
    </div>
  )
}