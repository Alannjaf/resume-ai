'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// Dynamically import PDF.js to avoid SSR issues
let pdfjsLib: any = null;

// Initialize PDF.js only on client side
const initPDFJS = async () => {
  if (typeof window !== 'undefined' && !pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist');
    // Use local PDF.js worker file to avoid CORS issues completely
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
  }
  return pdfjsLib;
};

interface PDFJSViewerProps {
  pdfData: ArrayBuffer | Uint8Array | null;
  onLoadError?: (error: Error) => void;
  className?: string;
  scale?: number;
}

export const PDFJSViewer = ({ 
  pdfData, 
  onLoadError, 
  className = '',
  scale = 1.0 
}: PDFJSViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rendering, setRendering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);

  // Ensure component is properly mounted
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    let isCancelled = false;
    
    const loadPDF = async () => {
      if (!pdfData || !mounted) {
        setLoading(false);
        return;
      }
      
      if (isCancelled) return;
      
      try {
        setLoading(true);
        
        // Initialize PDF.js on client side
        const pdfjs = await initPDFJS();
        if (!pdfjs) {
          throw new Error('Failed to initialize PDF.js');
        }
        
        // Wait for component to be fully mounted
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (isCancelled || !mounted) return;
        
        // Create a copy of the ArrayBuffer to prevent detachment issues
        let pdfDataCopy: Uint8Array;
        if (pdfData instanceof ArrayBuffer) {
          pdfDataCopy = new Uint8Array(pdfData.slice(0));
        } else {
          pdfDataCopy = new Uint8Array(pdfData);
        }
        
        if (isCancelled) return;
        
        // Load PDF document
        const loadingTask = pdfjs.getDocument({ data: pdfDataCopy });
        const pdf = await loadingTask.promise;
        
        if (isCancelled) return;
        
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
        
        if (!isCancelled && mounted) {
          await renderPage(pdf, 1);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Error loading PDF:', error);
          onLoadError?.(error as Error);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadPDF();
    
    return () => {
      isCancelled = true;
    };
  }, [pdfData, mounted]);

  const renderPage = async (pdf: any, pageNum: number) => {
    if (!mounted) {
      return;
    }

    setRendering(true);
    
    try {
      // Wait for canvas to be available with retries
      let canvas = canvasRef.current;
      let retries = 0;
      const maxRetries = 20; // 2 seconds max wait
      
      while (!canvas && retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 100));
        canvas = canvasRef.current;
        retries++;
      }
      
      if (!canvas) {
        setRendering(false);
        return;
      }
      
      const context = canvas.getContext('2d');
      if (!context) {
        setRendering(false);
        return;
      }

      // Get the PDF page
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      
      // Set canvas dimensions
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      // Clear canvas with white background
      context.fillStyle = 'white';
      context.fillRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      // Render the page
      await page.render(renderContext).promise;
      
      // Update current page after successful render
      setCurrentPage(pageNum);
      
    } catch (error) {
      console.error('Error rendering page:', error);
      onLoadError?.(error as Error);
    } finally {
      setRendering(false);
    }
  };

  const goToPage = async (pageNum: number) => {
    if (!pdfDoc || pageNum < 1 || pageNum > totalPages) return;
    
    setCurrentPage(pageNum);
    await renderPage(pdfDoc, pageNum);
  };

  const nextPage = () => goToPage(currentPage + 1);
  const prevPage = () => goToPage(currentPage - 1);

  // Always show the canvas - don't hide it behind loading states
  const showLoadingOverlay = loading;
  const showRenderingOverlay = rendering;

  // Don't render anything on server side
  if (!mounted) {
    return (
      <div className={`flex flex-col ${className}`}>
        <div className="flex-1 overflow-auto bg-gray-100 p-4 relative">
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Initializing PDF viewer...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 overflow-auto bg-gray-100 p-4 relative">
        {/* Loading overlay */}
        {showLoadingOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}
        
        {/* Rendering overlay */}
        {showRenderingOverlay && !showLoadingOverlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Rendering page...</p>
            </div>
          </div>
        )}
        
        <div className="flex justify-center">
          <canvas 
            ref={canvasRef}
            className="shadow-lg bg-white max-w-full h-auto"
            style={{ 
              display: 'block',
              minWidth: '200px',
              minHeight: '200px',
              border: '1px solid #ccc'
            }}
          />
        </div>
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 p-4 bg-white border-t">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};