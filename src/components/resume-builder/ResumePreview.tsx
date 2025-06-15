'use client'

import { TemplateRenderer } from '@/components/resume-templates/TemplateRenderer'
import { ResumeData } from '@/types/resume'

interface ResumePreviewProps {
  data: ResumeData
  template?: string
}

export function ResumePreview({ data, template = 'modern' }: ResumePreviewProps) {
  // Transform data to ensure all required fields have default values
  const transformedData: ResumeData = {
    ...data,
    education: data.education.map(edu => ({
      ...edu,
      gpa: edu.gpa || '',
      achievements: edu.achievements || ''
    })),
    skills: data.skills.map(skill => ({
      ...skill,
      level: skill.level || ''
    }))
  }

  return (
    <TemplateRenderer 
      template={template} 
      data={transformedData}
      className="resume-preview-content"
    />
  )
}