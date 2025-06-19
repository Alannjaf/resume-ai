'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { generateResumePDF, getResumePDFBlob } from '@/lib/pdfGenerator'
import { X, Download, RefreshCw } from 'lucide-react'
import { ResumeData } from '@/types/resume'
import toast from 'react-hot-toast'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  data: ResumeData
  template?: string
}

export function PreviewModal({ isOpen, onClose, data, template = 'modern' }: PreviewModalProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const generatePDFPreview = async () => {
    if (!data.personal.fullName) {
      toast.error('Please fill in your name before generating preview')
      return
    }

    setIsLoadingPreview(true)
    try {
      const blob = await getResumePDFBlob(data)
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (error) {
      toast.error('Failed to generate PDF preview')
      console.error('PDF preview error:', error)
    } finally {
      setIsLoadingPreview(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!data.personal.fullName) {
      toast.error('Please fill in your name before generating PDF')
      return
    }

    setIsGeneratingPDF(true)
    try {
      await generateResumePDF(data)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.')
      console.error('PDF generation error:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Generate PDF preview when modal opens
  useEffect(() => {
    if (isOpen && data.personal.fullName) {
      generatePDFPreview()
    }
    return () => {
      // Clean up URL object when modal closes
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
        setPdfUrl(null)
      }
    }
  }, [isOpen, data])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Resume Preview</h2>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline"
              onClick={generatePDFPreview}
              disabled={isLoadingPreview}
              size="sm"
            >
              {isLoadingPreview ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </>
              )}
            </Button>
            <Button 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              size="sm"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} size="sm">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="h-[calc(90vh-120px)]">
          {isLoadingPreview ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Generating PDF preview...</p>
              </div>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full border-0"
              title="Resume Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {!data.personal.fullName 
                    ? 'Please fill in your name to generate preview' 
                    : 'Click "Refresh" to generate PDF preview'
                  }
                </p>
                {data.personal.fullName && (
                  <Button onClick={generatePDFPreview} disabled={isLoadingPreview}>
                    Generate Preview
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}