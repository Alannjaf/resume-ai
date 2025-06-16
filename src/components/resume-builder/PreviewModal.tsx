'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ResumePreview } from './ResumePreview'
import { X, Download, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  data: any
  template?: string
}

export function PreviewModal({ isOpen, onClose, data, template = 'modern' }: PreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  if (!isOpen) return null

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default

      // Find the resume preview element
      const previewElement = document.querySelector('[data-resume-preview]') as HTMLElement
      if (!previewElement) {
        throw new Error('Preview element not found')
      }

      // Check if this is Executive, Tech, or Modern Yellow template and reduce spacing temporarily
      const isExecutive = template === 'executive'
      const isTech = template === 'tech'
      const isModernYellow = template === 'modern-yellow'
      let modifiedElements: Array<{element: HTMLElement, property: string, originalValue: string}> = []

      if (isExecutive || isTech || isModernYellow) {
        // Find elements with large spacing and temporarily reduce them
        const elementsToModify = previewElement.querySelectorAll('.mb-16, .mb-12, .mb-10, .pb-8, .p-10, .p-8')
        
        elementsToModify.forEach((el) => {
          const element = el as HTMLElement
          
          // Skip elements that contain yellow circles (to preserve emoji positioning)
          if (isModernYellow && (
            element.querySelector('.bg-yellow-400.rounded-full') || 
            element.classList.contains('bg-yellow-400') ||
            element.closest('.bg-yellow-400')
          )) {
            return // Don't modify yellow circle elements
          }
          
          const originalMarginBottom = element.style.marginBottom
          const originalPaddingBottom = element.style.paddingBottom
          const originalPadding = element.style.padding
          
          // Reduce spacing for PDF
          if (el.classList.contains('mb-16')) {
            element.style.marginBottom = '1.5rem'
            modifiedElements.push({element, property: 'marginBottom', originalValue: originalMarginBottom})
          } else if (el.classList.contains('mb-12')) {
            element.style.marginBottom = '1rem'
            modifiedElements.push({element, property: 'marginBottom', originalValue: originalMarginBottom})
          } else if (el.classList.contains('mb-10')) {
            element.style.marginBottom = '1rem'
            modifiedElements.push({element, property: 'marginBottom', originalValue: originalMarginBottom})
          }
          
          if (el.classList.contains('pb-8')) {
            element.style.paddingBottom = '0.5rem'
            modifiedElements.push({element, property: 'paddingBottom', originalValue: originalPaddingBottom})
          }
          
          if (el.classList.contains('p-10')) {
            element.style.padding = '1rem'
            modifiedElements.push({element, property: 'padding', originalValue: originalPadding})
          } else if (el.classList.contains('p-8')) {
            element.style.padding = '1rem'
            modifiedElements.push({element, property: 'padding', originalValue: originalPadding})
          }
        })

        // For Modern Yellow template, ensure full height layout for PDF
        if (isModernYellow) {
          // Don't modify min-height for this template - we want it to extend
          
          // Fix emoji positioning in yellow circles for PDF
          const yellowCircles = previewElement.querySelectorAll('.bg-yellow-400.rounded-full')
          yellowCircles.forEach((circle) => {
            const element = circle as HTMLElement
            const span = circle.querySelector('span')
            if (span) {
              const originalLineHeight = span.style.lineHeight
              const originalDisplay = span.style.display
              const originalTransform = span.style.transform
              const originalAlignItems = span.style.alignItems
              const originalJustifyContent = span.style.justifyContent
              
              span.style.lineHeight = '1'
              span.style.display = 'flex'
              span.style.alignItems = 'center'
              span.style.justifyContent = 'center'
              span.style.transform = 'translateY(-4px)' // Even stronger upward adjustment for PDF
              
              modifiedElements.push({element: span, property: 'lineHeight', originalValue: originalLineHeight})
              modifiedElements.push({element: span, property: 'display', originalValue: originalDisplay})
              modifiedElements.push({element: span, property: 'transform', originalValue: originalTransform})
              modifiedElements.push({element: span, property: 'alignItems', originalValue: originalAlignItems})
              modifiedElements.push({element: span, property: 'justifyContent', originalValue: originalJustifyContent})
            }
          })
        }
      }

      // Configure html2pdf options
      const options = {
        margin: 0,
        filename: `${data.personal?.fullName?.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_') || 'Resume'}_Resume.pdf`,
        image: { 
          type: 'jpeg', 
          quality: 0.98 
        },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait'
        },
        pagebreak: { 
          mode: ['avoid-all', 'css'],
          avoid: ['.keep-together']
        }
      }

      // Generate and download PDF
      await html2pdf().set(options).from(previewElement).save()
      
      // Restore original styles
      modifiedElements.forEach(({element, property, originalValue}) => {
        if (originalValue) {
          (element.style as any)[property] = originalValue
        } else {
          (element.style as any)[property] = ''
        }
      })
      
      toast.success('Resume exported as PDF successfully!', {
        duration: 3000
      })

    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Error generating PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Resume Preview</h2>
          <div className="flex items-center space-x-2">
            <Button 
              onClick={generatePDF}
              size="sm"
              disabled={isGenerating}
              className="flex items-center"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isGenerating ? 'Generating...' : 'Download PDF'}
            </Button>
            <Button variant="outline" onClick={onClose} size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {/* Visible Preview */}
          <ResumePreview data={data} template={template} />
        </div>
      </div>
    </div>
  )
}