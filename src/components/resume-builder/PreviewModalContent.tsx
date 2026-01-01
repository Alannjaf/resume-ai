'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { PDFJSViewer } from '@/components/pdf/PDFJSViewer'
import toast from 'react-hot-toast'

interface PreviewModalContentProps {
  isLoadingPreview: boolean
  usePDFJS: boolean
  pdfArrayBuffer: ArrayBuffer | null
  pdfUrl: string | null
  currentPdfUrl: string | null
  isMobile: boolean
  templateAccess: string
  currentPdfPage: number
  hasName: boolean
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  onGeneratePreview: () => void
  onContextMenu: (e: React.MouseEvent) => void
  onDragStart: (e: React.DragEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function PreviewModalContent({
  isLoadingPreview,
  usePDFJS,
  pdfArrayBuffer,
  pdfUrl,
  currentPdfUrl,
  isMobile,
  templateAccess,
  currentPdfPage,
  hasName,
  iframeRef,
  onGeneratePreview,
  onContextMenu,
  onDragStart,
  onKeyDown
}: PreviewModalContentProps) {
  if (isLoadingPreview) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Generating PDF preview...</p>
        </div>
      </div>
    )
  }

  if (usePDFJS && pdfArrayBuffer) {
    return (
      <PDFJSViewer
        pdfData={pdfArrayBuffer}
        className="w-full h-full"
        onLoadError={() => {
          toast.error('Failed to load PDF preview')
        }}
      />
    )
  }

  if (pdfUrl) {
    return (
      <div className="w-full h-full">
        {isMobile ? (
          <MobilePreview pdfUrl={pdfUrl} />
        ) : (
          <DesktopPreview
            pdfUrl={pdfUrl}
            currentPdfUrl={currentPdfUrl}
            currentPdfPage={currentPdfPage}
            templateAccess={templateAccess}
            iframeRef={iframeRef}
            onContextMenu={onContextMenu}
            onDragStart={onDragStart}
            onKeyDown={onKeyDown}
          />
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          {!hasName
            ? 'Please fill in your name to generate preview'
            : 'Click "Refresh" to generate PDF preview'}
        </p>
        {hasName && (
          <Button onClick={onGeneratePreview} disabled={isLoadingPreview}>
            Generate Preview
          </Button>
        )}
      </div>
    </div>
  )
}

function MobilePreview({ pdfUrl }: { pdfUrl: string }) {
  return (
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
  )
}

interface DesktopPreviewProps {
  pdfUrl: string
  currentPdfUrl: string | null
  currentPdfPage: number
  templateAccess: string
  iframeRef: React.RefObject<HTMLIFrameElement | null>
  onContextMenu: (e: React.MouseEvent) => void
  onDragStart: (e: React.DragEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

function DesktopPreview({
  pdfUrl,
  currentPdfUrl,
  currentPdfPage,
  templateAccess,
  iframeRef,
  onContextMenu,
  onDragStart,
  onKeyDown
}: DesktopPreviewProps) {
  return (
    <div className="w-full h-full relative">
      <iframe
        key={`pdf-page-${currentPdfPage}`}
        ref={iframeRef}
        src={currentPdfUrl || pdfUrl}
        className="w-full h-full border-0"
        title="Resume Preview"
        style={{ minHeight: '100%' }}
        allow="fullscreen"
      />

      {templateAccess === 'restricted' && (
        <div className="absolute inset-0 pointer-events-none z-5 flex items-center justify-center">
          <div
            className="transform -rotate-45 text-red-500 text-6xl font-bold opacity-20 select-none"
            style={{
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              fontSize: 'clamp(2rem, 8vw, 4rem)',
              lineHeight: '1.2',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}
          >
            PREVIEW ONLY<br />
            <span className="text-4xl">Upgrade to Download</span>
          </div>
        </div>
      )}

      <div
        className="absolute inset-0 bg-transparent z-10"
        onContextMenu={onContextMenu}
        onDragStart={onDragStart}
        onMouseDown={(e) => e.preventDefault()}
        onKeyDown={onKeyDown}
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
  )
}

