'use client'

import React from 'react'
import { Keyboard, ArrowRight } from 'lucide-react'

interface NavigationIndicatorProps {
  currentSection: number
  totalSections: number
  className?: string
}

export function NavigationIndicator({ 
  currentSection, 
  totalSections, 
  className = '' 
}: NavigationIndicatorProps) {
  return (
    <div className={`flex items-center space-x-2 text-sm text-gray-500 ${className}`}>
      <Keyboard className="h-4 w-4" />
      <span>
        Section {currentSection + 1} of {totalSections}
      </span>
      <span className="hidden sm:inline">
        • Press
      </span>
      <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded">
        Enter
      </kbd>
      <span className="hidden sm:inline">
        for next
      </span>
      <span className="hidden sm:inline">
        •
      </span>
      <kbd className="hidden sm:inline px-1.5 py-0.5 text-xs font-semibold bg-gray-100 border border-gray-200 rounded">
        F1
      </kbd>
      <span className="hidden sm:inline">
        for help
      </span>
    </div>
  )
}