'use client'

import { useState } from 'react'
import { AISuggestionButton } from './AISuggestionButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Check, X, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

interface AISkillsSuggesterProps {
  currentSkills: Array<{ id?: string; name: string; level?: string }>
  onAddSkills: (skills: Array<{ name: string; level: string }>) => void
  experience?: Array<{
    jobTitle: string
    company: string
  }>
}

export function AISkillsSuggester({ 
  currentSkills, 
  onAddSkills,
  experience = []
}: AISkillsSuggesterProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [formData, setFormData] = useState({
    jobTitle: experience[0]?.jobTitle || '',
    industry: ''
  })
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set())

  const generateSkills = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: formData.jobTitle,
          industry: formData.industry,
          language: 'en'
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate skills')
      }

      const data = await response.json()
      setSuggestedSkills(data.skills)
      setSelectedSkills(new Set())
      setShowSuggestions(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate skills')
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleSkillSelection = (skill: string) => {
    const newSelected = new Set(selectedSkills)
    if (newSelected.has(skill)) {
      newSelected.delete(skill)
    } else {
      newSelected.add(skill)
    }
    setSelectedSkills(newSelected)
  }

  const handleAddSelected = () => {
    const skillsToAdd = Array.from(selectedSkills).map(skill => ({
      name: skill,
      level: 'Intermediate'
    }))
    onAddSkills(skillsToAdd)
    setShowSuggestions(false)
    setSuggestedSkills([])
    setSelectedSkills(new Set())
  }

  const handleDismiss = () => {
    setShowSuggestions(false)
    setSuggestedSkills([])
    setSelectedSkills(new Set())
  }

  if (showSuggestions && suggestedSkills.length > 0) {
    return (
      <div className="mt-4">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start space-x-2 mb-3">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">AI</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-purple-900 mb-3">AI-Suggested Skills</h4>
              <p className="text-sm text-gray-600 mb-3">
                Select skills to add to your resume. Click to toggle selection.
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedSkills.map((skill, index) => {
                  const isSelected = selectedSkills.has(skill)
                  const isExisting = currentSkills.some(s => s.name.toLowerCase() === skill.toLowerCase())
                  
                  return (
                    <Badge
                      key={index}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        isExisting 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'hover:scale-105'
                      } ${
                        isSelected ? 'bg-purple-600 hover:bg-purple-700' : ''
                      }`}
                      onClick={() => !isExisting && toggleSkillSelection(skill)}
                    >
                      {isSelected && <Check className="h-3 w-3 mr-1" />}
                      {skill}
                      {isExisting && <span className="ml-1 text-xs">(added)</span>}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={handleAddSelected} 
              disabled={selectedSkills.size === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Selected ({selectedSkills.size})
            </Button>
            <Button size="sm" variant="outline" onClick={generateSkills}>
              Generate New
            </Button>
            <Button size="sm" variant="outline" onClick={handleDismiss}>
              <X className="h-4 w-4 mr-1" />
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3">Get AI-powered skill suggestions</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Job Title
            </label>
            <Input
              placeholder="e.g. Software Engineer"
              value={formData.jobTitle}
              onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
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
            />
          </div>
        </div>
        
        <AISuggestionButton
          onClick={generateSkills}
          disabled={!formData.jobTitle || isGenerating}
          className="w-full"
        >
          Suggest Relevant Skills
        </AISuggestionButton>
      </div>
    </div>
  )
}