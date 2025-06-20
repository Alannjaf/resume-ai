'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react'
import { AIJobDescriptionEnhancer } from '@/components/ai/AIJobDescriptionEnhancer'
import { WorkExperience } from '@/types/resume'

interface WorkExperienceFormProps {
  experiences: WorkExperience[]
  onChange: (experiences: WorkExperience[]) => void
}

export function WorkExperienceForm({ experiences, onChange }: WorkExperienceFormProps) {
  const addExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
    }
    onChange([...experiences, newExperience])
  }

  const removeExperience = (id: string) => {
    onChange(experiences.filter(exp => exp.id !== id))
  }

  const updateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    onChange(
      experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    )
  }

  return (
    <div className="space-y-4">
      {experiences.map((exp, index) => (
        <Card key={exp.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Experience #{index + 1}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeExperience(exp.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Job Title *
              </label>
              <Input
                placeholder="Software Engineer"
                value={exp.jobTitle}
                onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Company *
              </label>
              <Input
                placeholder="Tech Corp"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <MapPin className="inline h-3 w-3 mr-1" />
                Location
              </label>
              <Input
                placeholder="San Francisco, CA"
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Calendar className="inline h-3 w-3 mr-1" />
                Start Date
              </label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                End Date
              </label>
              <Input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={`current-${exp.id}`} className="text-sm">
                I currently work here
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              Job Description
            </label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              placeholder="• Developed and maintained web applications using React and Node.js
• Collaborated with cross-functional teams to deliver features
• Improved application performance by 40%"
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
            />
            
            {/* AI Job Description Enhancer */}
            <AIJobDescriptionEnhancer
              currentDescription={exp.description}
              jobTitle={exp.jobTitle}
              onAccept={(description) => updateExperience(exp.id, 'description', description)}
            />
          </div>
        </Card>
      ))}

      <Button onClick={addExperience} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Work Experience
      </Button>
    </div>
  )
}