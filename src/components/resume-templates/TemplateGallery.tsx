'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { templates, Template } from '@/lib/templates'
import { TemplateRenderer } from './TemplateRenderer'
import { X, Crown, Star } from 'lucide-react'

interface TemplateGalleryProps {
  isOpen: boolean
  onClose: () => void
  currentTemplate: string
  onSelectTemplate: (templateId: string) => void
  resumeData: any
}

export function TemplateGallery({ 
  isOpen, 
  onClose, 
  currentTemplate, 
  onSelectTemplate, 
  resumeData 
}: TemplateGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate)
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)

  if (!isOpen) return null

  const categories = [
    { id: 'all', name: 'All Templates' },
    { id: 'professional', name: 'Professional' },
    { id: 'modern', name: 'Modern' },
    { id: 'creative', name: 'Creative' },
    { id: 'minimal', name: 'Minimal' }
  ]

  const filteredTemplates = filterCategory === 'all' 
    ? templates 
    : templates.filter(template => template.category === filterCategory)

  const handleSelectTemplate = () => {
    onSelectTemplate(selectedTemplate)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-semibold">Choose a Template</h2>
            <p className="text-gray-600 mt-1">Select a design that matches your style</p>
          </div>
          <Button variant="outline" onClick={onClose} size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 border-r p-6 overflow-y-auto">
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setFilterCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                    filterCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <Crown className="h-3 w-3 mr-1" />
                Premium templates require subscription
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {previewTemplate ? (
              /* Full Preview */
              <div className="h-full flex flex-col">
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold">
                    {templates.find(t => t.id === previewTemplate)?.name} Preview
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewTemplate(null)}
                    >
                      Back to Gallery
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(previewTemplate)
                        handleSelectTemplate()
                      }}
                    >
                      Use This Template
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                  <div className="max-w-4xl mx-auto">
                    <TemplateRenderer 
                      template={previewTemplate} 
                      data={resumeData}
                      className="transform scale-75 origin-top"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Template Grid */
              <div className="h-full overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <Card 
                      key={template.id} 
                      className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedTemplate === template.id ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template.id)
                        onSelectTemplate(template.id)
                        onClose()
                      }}
                    >
                      <div className="aspect-[3/4] bg-gray-100 rounded-md mb-3 overflow-hidden relative">
                        {/* Template Preview Thumbnail */}
                        <div className="transform scale-25 origin-top-left">
                          <TemplateRenderer 
                            template={template.id} 
                            data={resumeData}
                          />
                        </div>
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="opacity-0 hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation()
                              setPreviewTemplate(template.id)
                            }}
                          >
                            Full Preview
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm">{template.name}</h3>
                          <div className="flex space-x-1">
                            {template.isPopular && (
                              <Badge variant="secondary" className="text-xs">
                                <Star className="h-3 w-3 mr-1" />
                                Popular
                              </Badge>
                            )}
                            {template.isPremium && (
                              <Badge variant="default" className="text-xs">
                                <Crown className="h-3 w-3 mr-1" />
                                Pro
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{template.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {!previewTemplate && (
          <div className="p-6 border-t flex justify-end items-center">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}