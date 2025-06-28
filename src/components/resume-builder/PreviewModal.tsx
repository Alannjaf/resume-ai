'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { getResumePDFBlob } from '@/lib/pdfGenerator'
import { X, Download, RefreshCw, ArrowUp, Crown } from 'lucide-react'
import { ResumeData } from '@/types/resume'
import { useSubscription } from '@/contexts/SubscriptionContext'
import toast from 'react-hot-toast'
import { PDFDocument } from 'pdf-lib'
import { shouldUsePDFJS } from '@/utils/browserDetection'
import { PDFJSViewer } from '@/components/pdf/PDFJSViewer'

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  data: ResumeData
  template?: string
}

export function PreviewModal({ isOpen, onClose, data, template = 'modern' }: PreviewModalProps) {
  const { availableTemplates } = useSubscription()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [pdfArrayBuffer, setPdfArrayBuffer] = useState<ArrayBuffer | null>(null)
  const [usePDFJS, setUsePDFJS] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [currentPdfPage, setCurrentPdfPage] = useState(1)
  const [totalPdfPages, setTotalPdfPages] = useState(1)
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string | null>(null)
  const currentPdfUrlRef = useRef<string | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Check if we should use PDF.js and detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent))
    }
    
    checkMobile()
    const shouldUsePDFJSResult = shouldUsePDFJS()
    setUsePDFJS(shouldUsePDFJSResult)
    
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Function to get actual page count from PDF
  const getPDFPageCount = async (blob: Blob): Promise<number> => {
    try {
      const arrayBuffer = await blob.arrayBuffer()
      const pdfDoc = await PDFDocument.load(arrayBuffer)
      return pdfDoc.getPageCount()
    } catch {
      return 1
    }
  }

  // Browser detection utility for desktop PDF parameters
  const detectBrowser = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes('edg/')) return 'edge'
    if (userAgent.includes('chrome') && !userAgent.includes('edg/')) return 'chrome'
    if (userAgent.includes('firefox')) return 'firefox'
    if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari'
    return 'unknown'
  }

  // Function to update PDF URL with page parameter for desktop
  const updatePdfUrl = useCallback((baseUrl: string, page: number) => {
    const browser = detectBrowser()
    let urlWithPage: string
    
    // Browser-specific PDF parameters to show full page within frame
    switch (browser) {
      case 'edge':
        urlWithPage = `${baseUrl}#toolbar=0&navpanes=0&scrollbar=1&view=Fit&zoom=65&page=${page}`
        break
      case 'firefox':
        urlWithPage = `${baseUrl}#page=${page}&zoom=page-fit&view=Fit`
        break
      case 'safari':
        urlWithPage = `${baseUrl}#page=${page}&view=Fit`
        break
      case 'chrome':
      default:
        urlWithPage = `${baseUrl}#toolbar=0&navpanes=0&scrollbar=1&view=Fit&zoom=page-fit&page=${page}`
        break
    }
    
    setCurrentPdfUrl(urlWithPage)
  }, [])

  // Page navigation functions for desktop
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const goToPage = (pageNum: number) => {
    if (pageNum >= 1 && pageNum <= totalPdfPages && pdfUrl) {
      setCurrentPdfPage(pageNum)
      updatePdfUrl(pdfUrl, pageNum)
    }
  }

  const generatePDFPreview = useCallback(async (retryCount = 0) => {
    if (!data.personal.fullName) {
      toast.error('Please fill in your name before generating preview')
      return
    }

    setIsLoadingPreview(true)
    try {
      const blob = await getResumePDFBlob(data, template)
      
      // Get page count
      const pageCount = await getPDFPageCount(blob)
      setTotalPdfPages(pageCount)
      setCurrentPdfPage(1)

      if (usePDFJS) {
        // Use PDF.js for mobile browsers - convert blob to ArrayBuffer
        const arrayBuffer = await blob.arrayBuffer()
        // Create a copy to prevent detachment
        const arrayBufferCopy = arrayBuffer.slice(0)
        
        // Add a small delay to ensure component is ready
        await new Promise(resolve => setTimeout(resolve, 100))
        
        setPdfArrayBuffer(arrayBufferCopy)
        setPdfUrl(null)
      } else {
        // Use traditional iframe method for desktop browsers
        if (currentPdfUrlRef.current) {
          URL.revokeObjectURL(currentPdfUrlRef.current)
        }
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
        // Set initial PDF URL with page 1 and browser-specific parameters
        updatePdfUrl(url, 1)
        currentPdfUrlRef.current = url
        setPdfArrayBuffer(null)
      }
    } catch {
      // Retry up to 2 times if generation fails
      if (retryCount < 2) {
        setTimeout(() => generatePDFPreview(retryCount + 1), 1000 * (retryCount + 1))
        return
      }
      
      toast.error('Failed to generate PDF preview')
    } finally {
      setIsLoadingPreview(false)
    }
  }, [data, template, usePDFJS, updatePdfUrl])

  // Safari-specific download function
  const downloadBlobSafari = (blob: Blob, filename: string) => {
    // Create a new blob with octet-stream MIME type to force download
    const downloadBlob = new Blob([blob], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(downloadBlob)
    
    // Create anchor element and trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.display = 'none'
    
    // Add to DOM, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Clean up the object URL
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 100)
  }

  const downloadPDF = async () => {
    setIsGeneratingPDF(true)
    try {
      // Track the download before generating PDF
      const trackingResponse = await fetch('/api/analytics/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: template,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        })
      }).catch(() => {
        // Handle network errors gracefully
        throw new Error('Network error while tracking download')
      })

      if (!trackingResponse.ok) {
        const error = await trackingResponse.json().catch(() => ({ error: 'Failed to track download' }))
        if (trackingResponse.status === 403) {
          toast.error(error.error || 'Export limit reached. Please upgrade your plan.')
          window.open('/billing', '_blank')
          return
        }
        throw new Error(error.error || error.message || 'Failed to track download')
      }

      // Generate and download PDF only if tracking succeeds
      const blob = await getResumePDFBlob(data, template)
      const filename = `${data.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      
      // Use Safari-specific download for Safari, regular blob download for other browsers
      const browser = detectBrowser()
      if (browser === 'safari') {
        downloadBlobSafari(blob, filename)
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
      
      toast.success('Resume downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      toast.error('Failed to download resume')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  // Prevent context menu and keyboard shortcuts
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && (e.key === 's' || e.key === 'p' || e.key === 'a')) {
      e.preventDefault()
    }
    if (e.key === 'F12') {
      e.preventDefault()
    }
  }

  // Generate PDF preview when modal opens or data changes
  useEffect(() => {
    if (isOpen && data.personal.fullName) {
      // Reset states first
      setIsLoadingPreview(true)
      setPdfArrayBuffer(null)
      setPdfUrl(null)
      setCurrentPdfUrl(null)
      
      // Add a longer delay to ensure component is fully mounted and ready
      const timer = setTimeout(() => {
        generatePDFPreview()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen, data, template, generatePDFPreview])

  // Clean up and reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Clear all PDF data when modal closes
      setPdfArrayBuffer(null)
      setPdfUrl(null)
      setCurrentPdfUrl(null)
      setCurrentPdfPage(1)
      setTotalPdfPages(1)
      setIsLoadingPreview(false)
      
      // Clean up URL object
      if (currentPdfUrlRef.current) {
        URL.revokeObjectURL(currentPdfUrlRef.current)
        currentPdfUrlRef.current = null
      }
    }
  }, [isOpen])

  // Clean up URL object on unmount
  useEffect(() => {
    return () => {
      if (currentPdfUrlRef.current) {
        URL.revokeObjectURL(currentPdfUrlRef.current)
        currentPdfUrlRef.current = null
      }
    }
  }, [])

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
                onClick={() => window.open('/billing', '_blank')}
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
              {pdfUrl && !isLoadingPreview && !isMobile && !usePDFJS && (
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
                onClick={() => generatePDFPreview()}
                disabled={isLoadingPreview}
                variant="outline"
                size="sm"
                className="text-xs sm:text-sm"
              >
                <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 ${isLoadingPreview ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={downloadPDF}
                disabled={isGeneratingPDF || isLoadingPreview || !data.personal.fullName || isTemplateRestricted}
                size="sm"
                className="text-xs sm:text-sm"
                title={isTemplateRestricted ? 'This template requires a premium plan' : undefined}
              >
                {isGeneratingPDF ? (
                  <>
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {isTemplateRestricted ? 'Upgrade to Download' : 'Download PDF'}
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
          ) : (usePDFJS && pdfArrayBuffer) ? (
            // PDF.js viewer for mobile browsers
            <PDFJSViewer 
              pdfData={pdfArrayBuffer}
              className="w-full h-full"
              onLoadError={() => {
                toast.error('Failed to load PDF preview')
              }}
            />
          ) : pdfUrl ? (
            <div className="w-full h-full">
              {isMobile ? (
                // Mobile view - simple without overlay
                <div className="w-full h-full overflow-auto bg-gray-100 p-4">
                  <object
                    data={`${pdfUrl}#view=Fit&zoom=page-fit`}
                    type="application/pdf"
                    className="w-full h-full min-h-[600px]"
                  >
                    <embed
                      src={`${pdfUrl}#view=Fit&zoom=page-fit`}
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
                      WebkitTapHighlightColor: 'transparent',
                      pointerEvents: 'auto',
                      cursor: 'default'
                    } as React.CSSProperties}
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
                  <Button onClick={() => generatePDFPreview()} disabled={isLoadingPreview}>
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