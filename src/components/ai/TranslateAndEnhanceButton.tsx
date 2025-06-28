'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, X, RefreshCw, Languages } from 'lucide-react'
import toast from 'react-hot-toast'
import { useLanguage } from '@/contexts/LanguageContext'
import { shouldShowTranslateButton } from '@/lib/languageDetection'

interface TranslateAndEnhanceButtonProps {
  content: string
  contentType: 'personal' | 'summary' | 'description' | 'achievement' | 'project'
  onAccept: (enhancedContent: string) => void
  contextInfo?: {
    jobTitle?: string
    company?: string
    projectName?: string
  }
  className?: string
}

export function TranslateAndEnhanceButton({ 
  content, 
  contentType,
  onAccept,
  contextInfo,
  className = ''
}: TranslateAndEnhanceButtonProps) {
  const { t } = useLanguage()
  const [isProcessing, setIsProcessing] = useState(false)
  const [enhancedContent, setEnhancedContent] = useState('')
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [shouldShow, setShouldShow] = useState(false)

  // Check if button should be shown based on content
  useEffect(() => {
    setShouldShow(shouldShowTranslateButton(content))
  }, [content])

  const translateAndEnhance = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content first')
      return
    }

    setIsProcessing(true)
    try {
      const response = await fetch('/api/ai/translate-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: content.trim(),
          contentType,
          sourceLanguage: 'auto', // Auto-detect
          contextInfo
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to translate and enhance content')
      }

      const data = await response.json()
      // Remove any markdown formatting symbols that might slip through
      const cleanContent = data.enhancedContent
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
        .replace(/\*(.*?)\*/g, '$1') // Remove *italic*
        .replace(/__(.*?)__/g, '$1') // Remove __bold__
        .replace(/_(.*?)_/g, '$1') // Remove _italic_
      setEnhancedContent(cleanContent)
      setShowSuggestion(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to translate and enhance content')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAccept = () => {
    onAccept(enhancedContent)
    setShowSuggestion(false)
    setEnhancedContent('')
    // Don't hide button - let useEffect handle visibility based on new content
  }

  const handleReject = () => {
    setShowSuggestion(false)
    setEnhancedContent('')
  }

  const handleRegenerate = () => {
    setShowSuggestion(false)
    setEnhancedContent('')
    translateAndEnhance()
  }

  // Don't render if content is already in English or too short
  if (!shouldShow) {
    return null
  }

  if (showSuggestion && enhancedContent) {
    return (
      <div className={`mt-4 ${className}`}>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 overflow-hidden">
          <div className="flex items-start space-x-2 mb-3">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Languages className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-green-900 mb-2">
                Translated & Enhanced to English
              </h4>
              <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                {enhancedContent}
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={handleAccept} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-1" />
              Use This
            </Button>
            <Button size="sm" variant="outline" onClick={handleRegenerate}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Regenerate
            </Button>
            <Button size="sm" variant="outline" onClick={handleReject}>
              <X className="h-4 w-4 mr-1" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`mt-2 ${className}`}>
      <Button
        onClick={translateAndEnhance}
        disabled={!content.trim() || isProcessing}
        size="sm"
        variant="outline"
        className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0 hover:from-green-600 hover:to-blue-600 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
            Translating...
          </>
        ) : (
          <>
            <Languages className="h-4 w-4 mr-2" />
            Translate to English & Enhance
          </>
        )}
      </Button>
    </div>
  )
}