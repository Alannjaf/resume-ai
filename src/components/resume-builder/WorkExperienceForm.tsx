'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, Calendar, MapPin } from 'lucide-react'
import { AIJobDescriptionEnhancer } from '@/components/ai/AIJobDescriptionEnhancer'
import { TranslateAndEnhanceButton } from '@/components/ai/TranslateAndEnhanceButton'
import { WorkExperience } from '@/types/resume'
import { useLanguage } from '@/contexts/LanguageContext'

interface WorkExperienceFormProps {
  experiences: WorkExperience[]
  onChange: (experiences: WorkExperience[]) => void
}

export function WorkExperienceForm({ experiences, onChange }: WorkExperienceFormProps) {
  const { t } = useLanguage()
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
            <h3 className="text-lg font-semibold">{t('forms.workExperience.experienceNumber', { number: index + 1 })}</h3>
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
                {t('forms.workExperience.fields.jobTitle')} *
              </label>
              <Input
                placeholder={t('forms.workExperience.placeholders.jobTitle')}
                value={exp.jobTitle}
                onChange={(e) => updateExperience(exp.id, 'jobTitle', e.target.value)}
              />
              <TranslateAndEnhanceButton
                content={exp.jobTitle}
                contentType="personal"
                onAccept={(jobTitle) => updateExperience(exp.id, 'jobTitle', jobTitle)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('forms.workExperience.fields.company')} *
              </label>
              <Input
                placeholder={t('forms.workExperience.placeholders.company')}
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
              />
              <TranslateAndEnhanceButton
                content={exp.company}
                contentType="personal"
                onAccept={(company) => updateExperience(exp.id, 'company', company)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <MapPin className="inline h-3 w-3 mr-1" />
                {t('forms.workExperience.fields.location')}
              </label>
              <Input
                placeholder={t('forms.workExperience.placeholders.location')}
                value={exp.location}
                onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
              />
              <TranslateAndEnhanceButton
                content={exp.location}
                contentType="personal"
                onAccept={(location) => updateExperience(exp.id, 'location', location)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Calendar className="inline h-3 w-3 mr-1" />
                {t('forms.workExperience.fields.startDate')}
              </label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('forms.workExperience.fields.endDate')}
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
                {t('forms.workExperience.fields.current')}
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              {t('forms.workExperience.fields.description')}
            </label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={4}
              placeholder={t('forms.workExperience.placeholders.description')}
              value={exp.description || ''}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
            />
            
            {/* AI Job Description Enhancer */}
            <AIJobDescriptionEnhancer
              currentDescription={exp.description || ''}
              jobTitle={exp.jobTitle || ''}
              onAccept={(description) => updateExperience(exp.id, 'description', description)}
            />
          </div>
        </Card>
      ))}

      <Button onClick={addExperience} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        {t('forms.workExperience.addButton')}
      </Button>
    </div>
  )
}