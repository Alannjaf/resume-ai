'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ResumePreview } from './ResumePreview'
import { X, Download, FileText, Loader2, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  data: any
  template?: string
}

export function PreviewModal({ isOpen, onClose, data, template = 'modern' }: PreviewModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (showDropdown && !target.closest('.dropdown-container')) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [showDropdown])

  if (!isOpen) return null

  const generatePDF = async () => {
    setIsGenerating(true)
    try {
      const { jsPDF } = await import('jspdf')
      const html2canvas = (await import('html2canvas')).default

      // Find the visible resume preview element
      const previewElement = document.querySelector('.resume-preview-content')
      if (!previewElement) {
        console.error('Preview element not found')
        toast.error('Could not find resume content to export')
        return
      }


      // Wait for fonts and images to load
      await document.fonts.ready
      await new Promise(resolve => setTimeout(resolve, 500))

      // Temporarily adjust the element for better PDF capture
      const originalStyle = {
        maxWidth: (previewElement as HTMLElement).style.maxWidth,
        margin: (previewElement as HTMLElement).style.margin,
        padding: (previewElement as HTMLElement).style.padding,
        boxShadow: (previewElement as HTMLElement).style.boxShadow,
        overflow: (previewElement as HTMLElement).style.overflow
      }

      // Set optimal styles for PDF
      const element = previewElement as HTMLElement
      element.style.maxWidth = '210mm' // A4 width
      element.style.margin = '0'
      element.style.padding = '15mm 20mm' // Reduced top/bottom padding
      element.style.boxShadow = 'none'
      element.style.overflow = 'visible'
      element.style.minHeight = 'auto'

      // Force a reflow
      element.offsetHeight

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        height: element.scrollHeight,
        width: element.scrollWidth,
        scrollX: 0,
        scrollY: 0
      })

      // Restore original styles
      element.style.maxWidth = originalStyle.maxWidth
      element.style.margin = originalStyle.margin
      element.style.padding = originalStyle.padding
      element.style.boxShadow = originalStyle.boxShadow
      element.style.overflow = originalStyle.overflow

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = 210 // A4 width in mm
      const pdfHeight = 297 // A4 height in mm
      
      // Calculate image dimensions to fit A4
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width
      
      let heightLeft = imgHeight
      let position = 0

      // Start from top with minimal margin
      const topMargin = 10 // Small top margin in mm
      
      if (imgHeight <= pdfHeight - topMargin) {
        // Single page - start from top with small margin
        pdf.addImage(imgData, 'PNG', 0, topMargin, imgWidth, imgHeight)
      } else {
        // Multiple pages needed - start from top
        pdf.addImage(imgData, 'PNG', 0, topMargin, imgWidth, imgHeight)
        heightLeft = imgHeight - (pdfHeight - topMargin)

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position + topMargin, imgWidth, imgHeight)
          heightLeft -= pdfHeight
        }
      }

      const fileName = data.personal.fullName || 'Resume'
      pdf.save(`${fileName}_Resume.pdf`)
    } catch (error) {
      toast.error('Error generating PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const generateDOC = async () => {
    setIsGenerating(true)
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import('docx')
      
      // Alternative to file-saver using native browser APIs
      const downloadBlob = (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }

      const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString + '-01')
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            // Header
            new Paragraph({
              text: data.personal.fullName || 'Your Name',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: [
                    data.personal.email,
                    data.personal.phone,
                    data.personal.location,
                    data.personal.linkedin,
                    data.personal.website
                  ].filter(Boolean).join(' | '),
                  size: 20,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // Professional Summary
            ...(data.summary ? [
              new Paragraph({
                text: 'Professional Summary',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 }
              }),
              new Paragraph({
                text: data.summary,
                spacing: { after: 400 }
              })
            ] : []),

            // Work Experience
            ...(data.experience.length > 0 ? [
              new Paragraph({
                text: 'Work Experience',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 }
              }),
              ...data.experience.flatMap((exp: any) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: exp.jobTitle,
                      bold: true,
                      size: 24
                    }),
                    new TextRun({
                      text: ` at ${exp.company}`,
                      size: 24
                    }),
                    new TextRun({
                      text: `\t${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`,
                      size: 20
                    })
                  ],
                  spacing: { after: 100 }
                }),
                ...(exp.location ? [new Paragraph({
                  text: exp.location,
                  spacing: { after: 100 }
                })] : []),
                ...(exp.description ? exp.description.split('\n').map((line: string) => 
                  new Paragraph({
                    text: line,
                    spacing: { after: 100 }
                  })
                ) : []),
                new Paragraph({ text: '', spacing: { after: 200 } })
              ])
            ] : []),

            // Education
            ...(data.education.length > 0 ? [
              new Paragraph({
                text: 'Education',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 }
              }),
              ...data.education.flatMap((edu: any) => [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${edu.degree} ${edu.field ? `in ${edu.field}` : ''}`,
                      bold: true,
                      size: 24
                    }),
                    new TextRun({
                      text: `\t${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`,
                      size: 20
                    })
                  ],
                  spacing: { after: 100 }
                }),
                new Paragraph({
                  text: edu.school + (edu.location ? `, ${edu.location}` : ''),
                  spacing: { after: 100 }
                }),
                ...(edu.gpa ? [new Paragraph({
                  text: `GPA: ${edu.gpa}`,
                  spacing: { after: 100 }
                })] : []),
                ...(edu.achievements ? edu.achievements.split('\n').map((line: string) => 
                  new Paragraph({
                    text: line,
                    spacing: { after: 100 }
                  })
                ) : []),
                new Paragraph({ text: '', spacing: { after: 200 } })
              ])
            ] : []),

            // Skills
            ...(data.skills.length > 0 ? [
              new Paragraph({
                text: 'Skills',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 }
              }),
              new Paragraph({
                text: data.skills.map((skill: any) => 
                  `${skill.name}${skill.level ? ` (${skill.level})` : ''}`
                ).join(', '),
                spacing: { after: 400 }
              })
            ] : []),

            // Languages
            ...(data.languages.length > 0 ? [
              new Paragraph({
                text: 'Languages',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 }
              }),
              new Paragraph({
                text: data.languages.map((lang: any) => 
                  `${lang.name} (${lang.proficiency})`
                ).join(', '),
                spacing: { after: 400 }
              })
            ] : []),
          ],
        }],
      })

      const blob = await Packer.toBlob(doc)
      const fileName = data.personal.fullName || 'Resume'
      downloadBlob(blob, `${fileName}_Resume.docx`)
    } catch (error) {
      console.error('Error generating DOC:', error)
      toast.error('Error generating DOC. Please try again.')
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
            <div className="relative dropdown-container">
              <Button 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowDropdown(!showDropdown)
                }}
                size="sm"
                disabled={isGenerating}
                className="flex items-center"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Download'}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
              
              {showDropdown && !isGenerating && (
                <div className="absolute top-full mt-1 right-0 bg-white border rounded-lg shadow-lg z-10 min-w-[140px]">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      generatePDF()
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 first:rounded-t-lg"
                  >
                    <FileText className="h-4 w-4 inline mr-2" />
                    PDF File
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      generateDOC()
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 last:rounded-b-lg border-t"
                  >
                    <FileText className="h-4 w-4 inline mr-2" />
                    DOC File
                  </button>
                </div>
              )}
            </div>
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