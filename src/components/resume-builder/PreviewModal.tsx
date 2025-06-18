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

  const identifyResumeGroups = (previewElement: HTMLElement) => {
    const groups: Array<{ type: string; element: HTMLElement }> = []
    
    // 1. Personal Info Group
    const personalInfoSelectors = [
      'header', // Common header tag
      '[data-section="personal"]', // Data attribute
      '.personal-info', // Class-based
      // Template-specific selectors
      '.text-center.mb-8', // Classic template header
      '.bg-gradient-to-r', // Executive/Creative templates with gradient headers
      '.bg-gray-900', // Tech template header
      '.border-b-2.border-blue-600', // Modern template header (border-bottom)
      '.border-l-4.border-blue-600' // Other templates with border-left
    ]
    
    for (const selector of personalInfoSelectors) {
      const personalInfo = previewElement.querySelector(selector) as HTMLElement
      if (personalInfo && personalInfo.textContent?.includes(data.personal?.fullName)) {
        groups.push({ type: 'Personal Info', element: personalInfo })
        break
      }
    }
    
    // 2. Experience Items (each experience as separate group, but NOT the entire section)
    const experienceSection = previewElement.querySelector('[data-section="experience"]') || 
                            previewElement.querySelector('.experience-section') ||
                            Array.from(previewElement.querySelectorAll('h2')).find(h => 
                              h.textContent?.toLowerCase().includes('experience') || 
                              h.textContent?.toLowerCase().includes('تجربه') ||
                              h.textContent?.toLowerCase().includes('خبرة')
                            )?.parentElement
    
    if (experienceSection) {
      // Find individual experience items only (don't group the entire section)
      let experienceItems = experienceSection.querySelectorAll('[data-section="experience-item"]')
      
      // If no items found with data attributes, use fallback selectors
      if (experienceItems.length === 0) {
        experienceItems = experienceSection.querySelectorAll('.space-y-4 > div, .space-y-6 > div')
      }
      
      experienceItems.forEach((item) => {
        const element = item as HTMLElement
        // Verify it's an experience item by checking for job title or company
        if (element.textContent?.match(/\d{4}/) || // Contains year
            element.querySelector('h3, .font-semibold, .text-lg')) { // Has title structure
          groups.push({ type: 'Experience Item', element })
        }
      })
    }
    
    // 3. Education Items (each education as separate group, but NOT the entire section)
    const educationSection = previewElement.querySelector('[data-section="education"]') ||
                            previewElement.querySelector('.education-section') ||
                            Array.from(previewElement.querySelectorAll('h2')).find(h => 
                              h.textContent?.toLowerCase().includes('education') || 
                              h.textContent?.toLowerCase().includes('خوێندن') ||
                              h.textContent?.toLowerCase().includes('تعليم')
                            )?.parentElement
    
    if (educationSection) {
      // Find individual education items only (don't group the entire section)
      let educationItems = educationSection.querySelectorAll('[data-section="education-item"]')
      
      // If no items found with data attributes, use fallback selectors
      if (educationItems.length === 0) {
        educationItems = educationSection.querySelectorAll('.space-y-4 > div, .space-y-6 > div')
      }
      
      educationItems.forEach((item) => {
        const element = item as HTMLElement
        // Verify it's an education item
        if (element.textContent?.match(/\d{4}/) || // Contains year
            element.querySelector('h3, .font-semibold, .text-lg')) { // Has title structure
          groups.push({ type: 'Education Item', element })
        }
      })
    }
    
    // 4. Skills Group
    const skillsSection = previewElement.querySelector('[data-section="skills"]') ||
                         previewElement.querySelector('.skills-section') ||
                         Array.from(previewElement.querySelectorAll('h2')).find(h => 
                           h.textContent?.toLowerCase().includes('skill') || 
                           h.textContent?.toLowerCase().includes('لێهاتوویی') ||
                           h.textContent?.toLowerCase().includes('مهارات')
                         )?.parentElement
    
    if (skillsSection) {
      groups.push({ type: 'Skills', element: skillsSection as HTMLElement })
    }
    
    // 5. Languages Group
    const languagesSection = previewElement.querySelector('[data-section="languages"]') ||
                           previewElement.querySelector('.languages-section') ||
                           Array.from(previewElement.querySelectorAll('h2')).find(h => 
                             h.textContent?.toLowerCase().includes('language') || 
                             h.textContent?.toLowerCase().includes('زمان') ||
                             h.textContent?.toLowerCase().includes('لغات')
                           )?.parentElement
    
    if (languagesSection) {
      groups.push({ type: 'Languages', element: languagesSection as HTMLElement })
    }
    
    // Check if Skills and Languages are in a grid container
    // For Modern template, they're often in a grid together
    const gridContainer = previewElement.querySelector('.grid.grid-cols-1.md\\:grid-cols-2') ||
                         previewElement.querySelector('.grid.grid-cols-2') ||
                         previewElement.querySelector('.grid')
    
    if (gridContainer && (skillsSection || languagesSection)) {
      // Check if this grid contains skills/languages
      const containsSkillsOrLangs = gridContainer.contains(skillsSection as Node) || 
                                   gridContainer.contains(languagesSection as Node)
      
      if (containsSkillsOrLangs) {
        // Add the entire grid as a group to keep skills and languages together
        groups.push({ type: 'Skills & Languages Grid', element: gridContainer as HTMLElement })
      }
    }
    
    // 6. Summary/About Group (if exists)
    const summarySection = previewElement.querySelector('[data-section="summary"]') ||
                          previewElement.querySelector('.summary-section') ||
                          Array.from(previewElement.querySelectorAll('h2')).find(h => 
                            h.textContent?.toLowerCase().includes('summary') || 
                            h.textContent?.toLowerCase().includes('about') ||
                            h.textContent?.toLowerCase().includes('پوختە') ||
                            h.textContent?.toLowerCase().includes('ملخص')
                          )?.parentElement
    
    if (summarySection) {
      groups.push({ type: 'Summary', element: summarySection as HTMLElement })
    }
    
    return groups
  }

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default

      // Find the resume preview element
      const previewElement = document.querySelector('[data-resume-preview]') as HTMLElement
      if (!previewElement) {
        throw new Error('Preview element not found')
      }
      
      // Identify all resume groups
      const groups = identifyResumeGroups(previewElement)
      
      // Console log the groups for verification
      console.log('=== Resume Groups Identified ===')
      console.log(`Total groups found: ${groups.length}`)
      groups.forEach((group, index) => {
        console.log(`${index + 1}. ${group.type}:`, {
          element: group.element,
          text: group.element.textContent?.substring(0, 100) + '...',
          height: group.element.offsetHeight + 'px',
          classes: group.element.className,
          computedStyle: {
            marginBottom: window.getComputedStyle(group.element).marginBottom,
            paddingBottom: window.getComputedStyle(group.element).paddingBottom,
            pageBreakAfter: window.getComputedStyle(group.element).pageBreakAfter,
            pageBreakBefore: window.getComputedStyle(group.element).pageBreakBefore
          }
        })
      })
      console.log('==============================')
      
      // Find experience section to check its positioning
      const experienceSection = groups.find(g => g.type === 'Experience Item' || g.type.includes('Experience'))
      if (experienceSection) {
        console.log('Experience Section Analysis:', {
          offsetTop: (experienceSection.element as any).offsetTop,
          parentOffsetTop: experienceSection.element.parentElement?.offsetTop,
          boundingRect: experienceSection.element.getBoundingClientRect()
        })
      }
      
      // Add page-break-inside: avoid to each group to prevent text cutoff
      const modifiedGroups: Array<{element: HTMLElement, originalPageBreakInside: string, originalBreakInside: string, originalDisplay: string}> = []
      
      groups.forEach((group) => {
        const originalPageBreakInside = group.element.style.pageBreakInside
        const originalBreakInside = group.element.style.breakInside
        const originalDisplay = group.element.style.display
        
        // Apply stronger page break avoidance
        group.element.style.pageBreakInside = 'avoid'
        group.element.style.breakInside = 'avoid'
        group.element.style.display = 'block'
        group.element.style.position = 'relative'
        
        // Store for later restoration
        modifiedGroups.push({
          element: group.element,
          originalPageBreakInside,
          originalBreakInside,
          originalDisplay
        })
        
        // Add a class for html2pdf to recognize
        group.element.classList.add('pdf-no-break')
      })
      
      // Also apply stronger rules to all experience and education items specifically
      const experienceItems = previewElement.querySelectorAll('[data-section="experience-item"]')
      const educationItems = previewElement.querySelectorAll('[data-section="education-item"]')
      
      const allItems = [...experienceItems, ...educationItems]
      const modifiedItems: Array<{element: HTMLElement, flexChildren: NodeListOf<Element>}> = []
      
      allItems.forEach((item) => {
        const element = item as HTMLElement
        element.style.pageBreakInside = 'avoid'
        element.style.breakInside = 'avoid'
        element.style.display = 'block'
        element.classList.add('pdf-no-break')
        
        // Also apply to all child flex containers
        const flexChildren = element.querySelectorAll('.flex')
        flexChildren.forEach((flexChild) => {
          const flexElement = flexChild as HTMLElement
          flexElement.style.display = 'block'
        })
        
        modifiedItems.push({ element, flexChildren })
      })
      
      // Continue with PDF generation after applying page break rules

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
        margin: [10, 10, 10, 10], // Add small margins to prevent content from being too close to edges
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
          logging: false,
          windowHeight: previewElement.scrollHeight // Capture full height
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        },
        pagebreak: { 
          mode: ['css', 'legacy'],
          avoid: ['.keep-together', '.pdf-no-break', '.grid', '[data-section="experience-item"]', '[data-section="education-item"]', 'h3', '.flex'],
          before: '.page-break-before',
          after: '.page-break-after'
        },
        enableLinks: false // Disable links to prevent layout issues
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
      
      // Restore group styles and remove added classes
      modifiedGroups.forEach(({element, originalPageBreakInside, originalBreakInside, originalDisplay}) => {
        element.style.pageBreakInside = originalPageBreakInside || ''
        element.style.breakInside = originalBreakInside || ''
        element.style.display = originalDisplay || ''
        element.style.position = ''
        element.classList.remove('pdf-no-break')
      })
      
      // Restore experience and education items
      modifiedItems.forEach(({element, flexChildren}) => {
        element.style.pageBreakInside = ''
        element.style.breakInside = ''
        element.style.display = ''
        element.classList.remove('pdf-no-break')
        
        // Restore flex children
        flexChildren.forEach((flexChild) => {
          const flexElement = flexChild as HTMLElement
          flexElement.style.display = ''
        })
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