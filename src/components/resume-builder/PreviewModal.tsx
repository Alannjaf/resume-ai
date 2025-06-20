'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { generateResumePDF, getResumePDFBlob } from '@/lib/pdfGenerator'
import { X, Download, RefreshCw, Crown, ArrowUp } from 'lucide-react'
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
  const [availableTemplates, setAvailableTemplates] = useState<string[]>(['modern'])

  const generatePDFPreview = useCallback(async () => {
    if (!data.personal.fullName) {
      toast.error('Please fill in your name before generating preview')
      return
    }

    setIsLoadingPreview(true)
    try {
      const blob = await getResumePDFBlob(data, template)
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
    } catch (error) {
      toast.error('Failed to generate PDF preview')
      console.error('PDF preview error:', error)
    } finally {
      setIsLoadingPreview(false)
    }
  }, [data, template])

  const handleDownloadPDF = async () => {
    if (!data.personal.fullName) {
      toast.error('Please fill in your name before generating PDF')
      return
    }

    setIsGeneratingPDF(true)
    try {
      // Track download event and check limits
      const analyticsResponse = await fetch('/api/analytics/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      })

      if (!analyticsResponse.ok) {
        const errorData = await analyticsResponse.json()
        if (analyticsResponse.status === 403) {
          // Check if it's a template restriction or export limit
          if (errorData.error?.includes('template')) {
            toast.error('This template requires a premium plan. Upgrade to download!', {
              duration: 5000,
              style: {
                background: '#f97316',
                color: '#fff',
              },
            })
          } else {
            toast.error(errorData.error || 'Export limit reached. Please upgrade your plan.')
          }
          return
        }
        throw new Error('Failed to track download')
      }

      await generateResumePDF(data, undefined, template)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.')
      console.error('PDF generation error:', error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Load user permissions when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadPermissions = async () => {
        try {
          const response = await fetch('/api/user/permissions')
          if (response.ok) {
            const permissions = await response.json()
            setAvailableTemplates(permissions.availableTemplates || ['modern'])
          }
        } catch (error) {
          console.error('Failed to load permissions:', error)
        }
      }
      loadPermissions()
    }
  }, [isOpen])

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
  }, [isOpen, data, generatePDFPreview])

  if (!isOpen) return null

  const isTemplateRestricted = !availableTemplates.includes(template)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Upgrade Banner for Restricted Templates */}
        {isTemplateRestricted && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Crown className="h-5 w-5" />
                <div>
                  <p className="font-semibold">Premium Template Preview</p>
                  <p className="text-sm opacity-90">This template requires a premium plan to download</p>
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white text-orange-600 hover:bg-gray-100"
                onClick={() => window.open('/pricing', '_blank')}
              >
                <ArrowUp className="h-4 w-4 mr-1" />
                Upgrade Now
              </Button>
            </div>
          </div>
        )}
        
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Resume Preview</h2>
            {isTemplateRestricted && (
              <p className="text-sm text-orange-600 mt-1">
                Template: {template.charAt(0).toUpperCase() + template.slice(1)} (Premium)
              </p>
            )}
          </div>
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
              disabled={isGeneratingPDF || isTemplateRestricted}
              size="sm"
              className={isTemplateRestricted ? 'opacity-50 cursor-not-allowed' : ''}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Downloading...
                </>
              ) : isTemplateRestricted ? (
                <>
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade to Download
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
              src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
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