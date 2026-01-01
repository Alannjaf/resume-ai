'use client'

import { Button } from '@/components/ui/button'
import { X, Download, RefreshCw, ArrowUp, Crown } from 'lucide-react'

interface PreviewModalHeaderProps {
  template: string
  isTemplateRestricted: boolean
  isLoadingPreview: boolean
  isGeneratingPDF: boolean
  hasName: boolean
  pdfUrl: string | null
  isMobile: boolean
  usePDFJS: boolean
  currentPdfPage: number
  totalPdfPages: number
  onRefresh: () => void
  onDownload: () => void
  onClose: () => void
  onPrevPage: () => void
  onNextPage: () => void
}

export function PreviewModalHeader({
  template,
  isTemplateRestricted,
  isLoadingPreview,
  isGeneratingPDF,
  hasName,
  pdfUrl,
  isMobile,
  usePDFJS,
  currentPdfPage,
  totalPdfPages,
  onRefresh,
  onDownload,
  onClose,
  onPrevPage,
  onNextPage
}: PreviewModalHeaderProps) {
  return (
    <>
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
            {pdfUrl && !isLoadingPreview && !isMobile && !usePDFJS && (
              <PageNavigationControls
                currentPage={currentPdfPage}
                totalPages={totalPdfPages}
                onPrevPage={onPrevPage}
                onNextPage={onNextPage}
              />
            )}
            <Button
              onClick={onRefresh}
              disabled={isLoadingPreview}
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm"
            >
              <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 ${isLoadingPreview ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {isTemplateRestricted ? (
              <Button
                onClick={() => window.open('/billing', '_blank')}
                size="sm"
                className="text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
              >
                <Crown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                Upgrade to Download
              </Button>
            ) : (
              <Button
                onClick={onDownload}
                disabled={isGeneratingPDF || isLoadingPreview || !hasName}
                size="sm"
                className="text-xs sm:text-sm"
              >
                {isGeneratingPDF ? (
                  <>
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Download PDF
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" onClick={onClose} size="sm" className="text-xs sm:text-sm">
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

interface PageNavigationControlsProps {
  currentPage: number
  totalPages: number
  onPrevPage: () => void
  onNextPage: () => void
}

function PageNavigationControls({ currentPage, totalPages, onPrevPage, onNextPage }: PageNavigationControlsProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
      <button
        onClick={onPrevPage}
        disabled={currentPage <= 1}
        className="flex items-center justify-center w-8 h-8 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-md transition-colors text-blue-600 disabled:text-gray-400 font-semibold"
      >
        ←
      </button>
      <span className="text-gray-700 font-medium min-w-[50px] text-center text-sm">
        {currentPage} / {totalPages}
      </span>
      <button
        onClick={onNextPage}
        disabled={currentPage >= totalPages}
        className="flex items-center justify-center w-8 h-8 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 disabled:cursor-not-allowed rounded-md transition-colors text-blue-600 disabled:text-gray-400 font-semibold"
      >
        →
      </button>
    </div>
  )
}

