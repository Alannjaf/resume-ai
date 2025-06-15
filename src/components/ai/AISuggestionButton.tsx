'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sparkles, Loader2 } from 'lucide-react'

interface AISuggestionButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  onClick: () => Promise<void>
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function AISuggestionButton({ 
  variant = 'outline',
  size = 'sm',
  onClick,
  children,
  disabled = false,
  className = ''
}: AISuggestionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (isLoading || disabled) return
    
    setIsLoading(true)
    try {
      await onClick()
    } catch (error) {
      console.error('AI suggestion error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading || disabled}
      className={`${className} transition-all hover:shadow-md`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
          {children}
        </>
      )}
    </Button>
  )
}