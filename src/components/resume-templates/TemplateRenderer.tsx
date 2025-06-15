'use client'

import React from 'react'
import { ModernTemplate } from './ModernTemplate'
import { ClassicTemplate } from './ClassicTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { CreativeTemplate } from './CreativeTemplate'
import type { ResumeData } from '@/types/resume'

export type { ResumeData }

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