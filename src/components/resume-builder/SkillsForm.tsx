'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Trash2, Zap } from 'lucide-react'
import { AISkillsSuggester } from '@/components/ai/AISkillsSuggester'
import { Skill } from '@/types/resume'

interface SkillsFormProps {
  skills: Skill[]
  onChange: (skills: Skill[]) => void
  experience?: Array<{
    jobTitle: string
    company: string
  }>
}

export function SkillsForm({ skills, onChange, experience = [] }: SkillsFormProps) {
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate',
    }
    onChange([...skills, newSkill])
  }

  const removeSkill = (id: string) => {
    onChange(skills.filter(skill => skill.id !== id))
  }

  const updateSkill = (id: string, field: keyof Skill, value: string) => {
    onChange(
      skills.map(skill =>
        skill.id === id ? { ...skill, [field]: value } : skill
      )
    )
  }

  const addSkillsFromAI = (aiSkills: Array<{ name: string; level: string }>) => {
    const newSkills = aiSkills.map(skill => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: skill.name,
      level: skill.level
    }))
    onChange([...skills, ...newSkills])
  }

  return (
    <div className="space-y-4">
      {/* AI Section First - Highlighted */}
      <div className="relative">
        {/* Attention-grabbing header */}
        <div className="absolute -top-3 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
          ✨ AI-Powered
        </div>
        
        {/* AI Skills Suggester */}
        <AISkillsSuggester
          currentSkills={skills}
          onAddSkills={addSkillsFromAI}
          experience={experience}
        />
      </div>

      {/* Divider with "OR" */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">OR add manually</span>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Tip:</strong> Include both technical and soft skills relevant to your target job.
        </p>
      </div>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <Card key={skill.id} className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">
                  Skill Name
                </label>
                <Input
                  placeholder="e.g., JavaScript, Project Management, Communication"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full sm:w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:hidden">
                  Proficiency Level
                </label>
                <select
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <div className="flex justify-end sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSkill(skill.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-1 sm:mr-0" />
                  <span className="sm:hidden">Remove</span>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={addSkill} variant="outline" className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add Skill
      </Button>

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Zap className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p>No skills added yet</p>
          <p className="text-sm">Click "Add Skill" or use AI suggestions to get started</p>
        </div>
      )}
    </div>
  )
}