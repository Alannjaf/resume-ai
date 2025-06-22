'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, GraduationCap, Calendar } from 'lucide-react'
import { Education } from '@/types/resume'
import { useLanguage } from '@/contexts/LanguageContext'

interface EducationFormProps {
  education: Education[]
  onChange: (education: Education[]) => void
}

export function EducationForm({ education, onChange }: EducationFormProps) {
  const { t } = useLanguage()
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      degree: '',
      field: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
    }
    onChange([...education, newEducation])
  }

  const removeEducation = (id: string) => {
    onChange(education.filter(edu => edu.id !== id))
  }

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    onChange(
      education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    )
  }

  return (
    <div className="space-y-4">
      {education.map((edu, index) => (
        <Card key={edu.id} className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">
              <GraduationCap className="inline h-5 w-5 mr-2" />
              {t('forms.education.educationNumber', { number: index + 1 })}
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => removeEducation(edu.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('forms.education.fields.degree')} *
              </label>
              <Input
                placeholder={t('forms.education.placeholders.degree')}
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('forms.education.fields.fieldOfStudy')} *
              </label>
              <Input
                placeholder={t('forms.education.placeholders.fieldOfStudy')}
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('forms.education.fields.school')} *
              </label>
              <Input
                placeholder={t('forms.education.placeholders.school')}
                value={edu.school}
                onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('forms.education.fields.location')}
              </label>
              <Input
                placeholder={t('forms.education.placeholders.location')}
                value={edu.location}
                onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                <Calendar className="inline h-3 w-3 mr-1" />
                {t('forms.education.fields.startDate')}
              </label>
              <Input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('forms.education.fields.endDate')}
              </label>
              <Input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t('forms.education.fields.gpa')}
              </label>
              <Input
                placeholder={t('forms.education.placeholders.gpa')}
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">
              {t('forms.education.fields.achievements')}
            </label>
            <textarea
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              placeholder={t('forms.education.placeholders.achievements')}
              value={edu.achievements || ''}
              onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value)}
            />
          </div>
        </Card>
      ))}

      <Button onClick={addEducation} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        {t('forms.education.addButton')}
      </Button>
    </div>
  )
}