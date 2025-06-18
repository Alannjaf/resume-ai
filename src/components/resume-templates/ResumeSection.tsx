import React from 'react'
import { cn } from '@/lib/utils'

interface ResumeSectionProps {
  title?: string
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'languages' | 'projects' | 'certifications' | 'custom'
  className?: string
  children: React.ReactNode
  titleClassName?: string
}

export function ResumeSection({ title, type, className, children, titleClassName }: ResumeSectionProps) {
  const sectionClasses = cn(
    {
      'mb-8': type !== 'header' && type !== 'summary',
      'mb-6': type === 'summary',
    },
    className
  )

  return (
    <div className={sectionClasses}>
      {title && (
        <h2 className={cn(titleClassName)}>
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

interface ResumeSectionItemProps {
  type: 'experience' | 'education' | 'project' | 'certification'
  className?: string
  children: React.ReactNode
}

export function ResumeSectionItem({ type, className, children }: ResumeSectionItemProps) {
  const itemClasses = cn(
    className
  )

  return (
    <div className={itemClasses}>
      {children}
    </div>
  )
}