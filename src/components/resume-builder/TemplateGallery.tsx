'use client'

import React from 'react'
import { Check, Lock, Crown } from 'lucide-react'
import { TemplateThumbnail } from './TemplateThumbnail'

interface TemplateOption {
  id: string
  name: string
  description: string
  thumbnail: string
  category: 'professional' | 'creative' | 'minimal'
}

const templates: TemplateOption[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, professional layout with dual columns',
    thumbnail: '/api/placeholder/300/400', // We'll generate these
    category: 'professional'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic design with visual elements and colors',
    thumbnail: '/api/placeholder/300/400', // We'll generate these
    category: 'creative'
  },
  {
    id: 'executive',
    name: 'Executive Professional',
    description: 'Clean executive layout with elegant typography',
    thumbnail: '/thumbnails/executive.svg',
    category: 'professional'
  }
]

interface TemplateGalleryProps {
  selectedTemplate: string
  onTemplateSelect: (templateId: string) => void
  className?: string
  allowedTemplates?: string[]
}

export function TemplateGallery({ 
  selectedTemplate, 
  onTemplateSelect, 
  className = '',
  allowedTemplates 
}: TemplateGalleryProps) {
  // Show all templates but track which ones are allowed
  const availableTemplates = templates
  const userAllowedTemplates = allowedTemplates || []
  return (
    <div className={`template-gallery ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Template</h3>
        <p className="text-sm text-gray-600">
          Select a template that best fits your style and industry
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTemplates.map((template) => {
          const isLocked = !userAllowedTemplates.includes(template.id)
          const isSelected = selectedTemplate === template.id
          
          return (
            <div
              key={template.id}
              className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : isLocked
                  ? 'border-gray-200 hover:border-orange-300 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onTemplateSelect(template.id)}
            >
            {/* Selection indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 z-10 bg-blue-500 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            )}
            
            {/* Lock indicator for restricted templates */}
            {isLocked && (
              <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white rounded-full p-1">
                <Lock className="h-4 w-4" />
              </div>
            )}
            
            {/* Thumbnail */}
            <div className="aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden">
              <TemplateThumbnail 
                templateId={template.id} 
                className="w-full h-full"
              />
            </div>
            
            {/* Template info */}
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
              <p className="text-sm text-gray-600">{template.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  template.category === 'professional' 
                    ? 'bg-blue-100 text-blue-800'
                    : template.category === 'creative'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {template.category}
                </span>
                {isLocked && (
                  <span className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                    <Crown className="h-3 w-3 mr-1" />
                    PRO
                  </span>
                )}
              </div>
              {isLocked && (
                <p className="text-xs text-orange-600 mt-2">
                  Upgrade to access this template
                </p>
              )}
            </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}