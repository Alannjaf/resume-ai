'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  onEnterKey?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onTabKey?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  enableNavigation?: boolean
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    className, 
    type, 
    onEnterKey, 
    onTabKey, 
    enableNavigation = true,
    onKeyDown,
    ...props 
  }, ref) => {
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      // Call custom onKeyDown first
      onKeyDown?.(event)
      
      // Only handle navigation if enabled and event wasn't prevented
      if (!enableNavigation || event.defaultPrevented) return
      
      switch (event.key) {
        case 'Enter':
          onEnterKey?.(event)
          break
        case 'Tab':
          onTabKey?.(event)
          break
      }
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base sm:text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px] touch-manipulation transition-colors",
          "focus:ring-2 focus:ring-blue-500 focus:border-blue-500", // Enhanced focus styles
          className
        )}
        ref={ref}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)
FormInput.displayName = "FormInput"

export { FormInput }