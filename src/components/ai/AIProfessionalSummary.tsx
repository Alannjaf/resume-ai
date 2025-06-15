'use client'

import { useState } from 'react'
import { AISuggestionButton } from './AISuggestionButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, X, RefreshCw } from 'lucide-react'

interface AIProfessionalSummaryProps {
  currentSummary: string
  onAccept: (summary: string) => void
  personalInfo?: {
    fullName?: string
    email?: string
  }
  experience?: Array<{
    jobTitle: string
    company: string
  }>
  skills?: Array<{
    name: string
  }>
}

export function AIProfessionalSummary({ 
  currentSummary, 
  onAccept, 
  personalInfo,
  experience = [],
  skills = []
}: AIProfessionalSummaryProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSummary, setGeneratedSummary] = useState('')
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [formData, setFormData] = useState({
    jobTitle: experience[0]?.jobTitle || '',
    industry: '',
    experienceLevel: ''
  })

  const generateSummary = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          industry: formData.industry,
          experience: formData.experienceLevel,
          skills: skills.map(s => s.name),
          language: 'en'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate summary')
      }

      const data = await response.json()
      setGeneratedSummary(data.summary)
      setShowSuggestion(true)
    } catch (error) {
      console.error('Error generating summary:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate summary')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAccept = () => {
    onAccept(generatedSummary)
    setShowSuggestion(false)
    setGeneratedSummary('')
  }

  const handleReject = () => {
    setShowSuggestion(false)
    setGeneratedSummary('')
  }

  const handleRegenerate = () => {
    setShowSuggestion(false)
    setGeneratedSummary('')
    generateSummary()
  }

  if (showSuggestion && generatedSummary) {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-2 mb-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">AI</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-purple-900 mb-2">AI-Generated Professional Summary</h4>
              <p className="text-gray-700 leading-relaxed">{generatedSummary}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
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
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3">Let AI help you write a professional summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Job Title
            </label>
            <Input
              placeholder="e.g. Software Engineer"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              size="sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry
            </label>
            <Input
              placeholder="e.g. Technology"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              size="sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <Input
              placeholder="e.g. 3 years"
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
              size="sm"
            />
          </div>
        </div>
        
        <AISuggestionButton
          onClick={generateSummary}
          disabled={!formData.jobTitle || isGenerating}
          className="w-full"
        >
          Generate Professional Summary
        </AISuggestionButton>
      </div>
    </div>
  )
}