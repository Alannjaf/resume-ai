'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { generateResumePDF, getResumePDFBlob } from '@/lib/pdfGenerator'
import { X, Download, RefreshCw, Crown, ArrowUp } from 'lucide-react'
import { ResumeData } from '@/types/resume'
import toast from 'react-hot-toast'
import { PDFDocument } from 'pdf-lib'

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
  const [isMobile, setIsMobile] = useState(false)
  const [currentPdfPage, setCurrentPdfPage] = useState(1)
  const [totalPdfPages, setTotalPdfPages] = useState(1)
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null)
  const currentPdfUrlRef = useRef<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Function to get actual page count from PDF
  const getPDFPageCount = async (blob: Blob): Promise<number> => {
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      return pdfDoc.getPageCount()
    } catch (error) {
      console.error('Error getting PDF page count:', error)
      return 1 // Default to 1 page if parsing fails
    }
  }

  const generatePDFPreview = useCallback(async () => {
    if (!data.personal.fullName) {
      toast.error('Please fill in your name before generating preview')
      return
    }

    setIsLoadingPreview(true)
    try {
      // Clean up previous URL if it exists
      if (currentPdfUrlRef.current) {
        URL.revokeObjectURL(currentPdfUrlRef.current)
        currentPdfUrlRef.current = null
      }
      
      const blob = await getResumePDFBlob(data, template)
      const url = URL.createObjectURL(blob)
      currentPdfUrlRef.current = url
      setPdfUrl(url)
      setCurrentPdfPage(1) // Reset to first page
      
      // Get actual page count from the PDF
      const pageCount = await getPDFPageCount(blob)
      setTotalPdfPages(pageCount)
      
      // Update current PDF URL for page navigation
      updatePdfUrl(url, 1)
    } catch (error) {
      toast.error('Failed to generate PDF preview')
      console.error('PDF preview error:', error)
    } finally {
      setIsLoadingPreview(false)
    }
  }, [data, template]) // Include data and template as dependencies

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

  // Function to update PDF URL with page parameter
  const updatePdfUrl = (baseUrl: string, page: number) => {
    const urlWithPage = `${baseUrl}#toolbar=0&navpanes=0&scrollbar=1&view=Fit&zoom=page-fit&page=${page}`
    setCurrentPdfUrl(urlWithPage)
  }

  // Page navigation functions
  const goToNextPage = () => {
    if (currentPdfPage < totalPdfPages && pdfUrl) {
      const newPage = currentPdfPage + 1
      setCurrentPdfPage(newPage)
      updatePdfUrl(pdfUrl, newPage)
    }
  }

  const goToPrevPage = () => {
    if (currentPdfPage > 1 && pdfUrl) {
      const newPage = currentPdfPage - 1
      setCurrentPdfPage(newPage)
      updatePdfUrl(pdfUrl, newPage)
    }
  }

  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPdfPages && pdfUrl) {
      setCurrentPdfPage(pageNum)
      updatePdfUrl(pdfUrl, pageNum)
    }
  }

  // Right-click prevention handlers
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Keyboard shortcut prevention
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Ctrl+S (save), Ctrl+P (print), Ctrl+A (select all)
    if (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'a')) {
      e.preventDefault()
    }
    // Prevent F12 (developer tools)
    if (e.key === 'F12') {
      e.preventDefault()
    }
  }

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  // Generate PDF preview when modal opens or data changes
  useEffect(() => {
    if (isOpen && data.personal.fullName) {
      generatePDFPreview()
    }
  }, [isOpen, data, template, generatePDFPreview]) // Safe to include generatePDFPreview with proper dependencies

  // Clean up URL object when modal closes or component unmounts
  useEffect(() => {
    return () => {
      if (currentPdfUrlRef.current) {
        URL.revokeObjectURL(currentPdfUrlRef.current)
        currentPdfUrlRef.current = null
      }
    }
  }, []) // Remove isOpen dependency to prevent unnecessary cleanup calls

  if (!isOpen) return null

  const isTemplateRestricted = !availableTemplates.includes(template)

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden pdf-preview-modal">
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
        <div className="p-4 sm:p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold">Resume Preview</h2>
              {isTemplateRestricted && (
                <p className="text-sm text-orange-600 mt-1">
                  Template: {template.charAt(0).toUpperCase() + template.slice(1)} (Premium)
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Page Navigation Controls - Desktop Only */}
              {pdfUrl && !isLoadingPreview && !isMobile && (
                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <button
                    onClick={goToPrevPage}
                    disabled={currentPdfPage <= 1}
                    className="flex items-center justify-center w-8 h-8 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-md transition-colors text-blue-600 disabled:text-gray-400 font-semibold"
                  >
                    ←
                  </button>
                  <span className="text-gray-700 font-medium min-w-[50px] text-center text-sm">
                    {currentPdfPage} / {totalPdfPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPdfPage >= totalPdfPages}
                    className="flex items-center justify-center w-8 h-8 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-md transition-colors text-blue-600 disabled:text-gray-400 font-semibold"
                  >
                    →
                  </button>
                </div>
              )}
              
              <Button 
                variant="outline"
                onClick={generatePDFPreview}
                disabled={isLoadingPreview}
                size="sm"
                className="text-xs sm:text-sm"
              >
                {isLoadingPreview ? (
                  <>
                    <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 border-2 border-gray-600 border-t-transparent rounded-full" />
                    <span className="hidden sm:inline">Loading...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Refresh</span>
                  </>
                )}
              </Button>
              <Button 
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF || isTemplateRestricted}
                size="sm"
                className={`text-xs sm:text-sm ${isTemplateRestricted ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isGeneratingPDF ? (
                  <>
                    <div className="animate-spin h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 border-2 border-white border-t-transparent rounded-full" />
                    <span className="hidden sm:inline">Downloading...</span>
                  </>
                ) : isTemplateRestricted ? (
                  <>
                    <Crown className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Upgrade</span>
                    <span className="sm:hidden">Pro</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Download</span>
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={onClose} size="sm" className="text-xs sm:text-sm">
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
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
            <div className="w-full h-full">
              {isMobile ? (
                // Mobile view - simple without overlay
                <div className="w-full h-full overflow-auto bg-gray-100 p-4">
                  <object
                    data={`${pdfUrl}#zoom=75&view=Fit`}
                    type="application/pdf"
                    className="w-full h-full min-h-[600px]"
                  >
                    <embed
                      src={`${pdfUrl}#zoom=75&view=Fit`}
                      type="application/pdf"
                      className="w-full h-full"
                    />
                  </object>
                </div>
              ) : (
                // Desktop view with overlay protection and page navigation
                <div className="w-full h-full relative">
                  <iframe
                    key={`pdf-page-${currentPdfPage}`}
                    ref={iframeRef}
                    src={currentPdfUrl || pdfUrl}
                    className="w-full h-full border-0"
                    title="Resume Preview"
                    style={{ minHeight: '100%' }}
                  />
                  {/* Enhanced protection overlay */}
                  <div 
                    className="absolute inset-0 bg-transparent z-10"
                    onContextMenu={handleContextMenu}
                    onDragStart={handleDragStart}
                    onMouseDown={(e) => e.preventDefault()}
                    onKeyDown={handleKeyDown}
                    tabIndex={-1}
                    style={{
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      MozUserSelect: 'none',
                      msUserSelect: 'none',
                      WebkitTouchCallout: 'none',
                      WebkitUserDrag: 'none',
                      WebkitTapHighlightColor: 'transparent',
                      pointerEvents: 'auto',
                      cursor: 'default'
                    }}
                  />
                </div>
              )}
            </div>
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