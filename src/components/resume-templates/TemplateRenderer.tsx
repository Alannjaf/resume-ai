'use client'

import React from 'react'
import { ModernTemplate } from './ModernTemplate'
import { ClassicTemplate } from './ClassicTemplate'
import { MinimalTemplate } from './MinimalTemplate'
import { CreativeTemplate } from './CreativeTemplate'
import { ExecutiveTemplate } from './ExecutiveTemplate'
import { TechTemplate } from './TechTemplate'
import { ModernYellowTemplate } from './ModernYellowTemplate'
import { CleanModernTemplate } from './CleanModernTemplate'
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
        return <ExecutiveTemplate data={data} />
      case 'tech':
        return <TechTemplate data={data} />
      case 'modern-yellow':
        return <ModernYellowTemplate data={data} />
      case 'clean-modern':
        return <CleanModernTemplate data={data} />
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