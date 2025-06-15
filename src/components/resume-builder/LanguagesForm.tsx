'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, Globe } from 'lucide-react'

interface Language {
  id: string
  name: string
  proficiency: string
}

interface LanguagesFormProps {
  languages: Language[]
  onChange: (languages: Language[]) => void
}

export function LanguagesForm({ languages, onChange }: LanguagesFormProps) {
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: '',
      proficiency: 'Conversational',
    }
    onChange([...languages, newLanguage])
  }

  const removeLanguage = (id: string) => {
    onChange(languages.filter(lang => lang.id !== id))
  }

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    onChange(
      languages.map(lang =>
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>Tip:</strong> Include proficiency levels to help employers understand your language abilities.
        </p>
      </div>

      <div className="space-y-3">
        {languages.map((language, index) => (
          <Card key={language.id} className="p-4">
            <div className="flex items-center space-x-3">
              <div className="flex-1">
                <Input
                  placeholder="e.g., English, Arabic, Kurdish Sorani, Spanish"
                  value={language.name}
                  onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                />
              </div>
              <div className="w-40">
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={language.proficiency}
                  onChange={(e) => updateLanguage(language.id, 'proficiency', e.target.value)}
                >
                  <option value="Basic">Basic</option>
                  <option value="Conversational">Conversational</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Native">Native</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeLanguage(language.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={addLanguage} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Language
      </Button>

      {languages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Globe className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>No languages added yet</p>
          <p className="text-sm">Click "Add Language" to get started</p>
        </div>
      )}
    </div>
  )
}