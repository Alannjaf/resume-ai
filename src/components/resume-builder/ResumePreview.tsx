'use client'

import { TemplateRenderer } from '@/components/resume-templates/TemplateRenderer'

interface ResumeData {
  personal: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
  }
  summary: string
  experience: Array<{
    id?: string
    jobTitle: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id?: string
    degree: string
    field: string
    school: string
    location: string
    startDate: string
    endDate: string
    gpa?: string
    achievements?: string
  }>
  skills: Array<{
    id?: string
    name: string
    level?: string
  }>
  languages: Array<{
    id?: string
    name: string
    proficiency: string
  }>
}

interface ResumePreviewProps {
  data: ResumeData
  template?: string
}

export function ResumePreview({ data, template = 'modern' }: ResumePreviewProps) {
  return (
    <TemplateRenderer 
      template={template} 
      data={data}
      className="resume-preview-content"
    />
  )
}