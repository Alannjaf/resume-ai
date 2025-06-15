'use client'

import React from 'react'
import { ModernTemplate } from './ModernTemplate'
import { ClassicTemplate } from './ClassicTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { CreativeTemplate } from './CreativeTemplate'

export interface ResumeData {
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
    jobTitle: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    degree: string
    field: string
    school: string
    location: string
    startDate: string
    endDate: string
    gpa: string
    achievements: string
  }>
  skills: Array<{
    name: string
    level: string
  }>
  languages: Array<{
    name: string
    proficiency: string
  }>
}

interface TemplateRendererProps {
  template: string
  data: ResumeData
  className?: string
}

export function TemplateRenderer({ template, data, className = '' }: TemplateRendererProps) {
  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return <ModernTemplate data={data} />
      case 'classic':
        return <ClassicTemplate data={data} />
      case 'minimal':
        return <MinimalTemplate data={data} />
      case 'creative':
        return <CreativeTemplate data={data} />
      case 'executive':
        return <ClassicTemplate data={data} /> // Fallback to classic for now
      case 'tech':
        return <ModernTemplate data={data} /> // Fallback to modern for now
      default:
        return <ModernTemplate data={data} />
    }
  }

  return (
    <div className={`resume-preview-content ${className}`}>
      {renderTemplate()}
    </div>
  )
}