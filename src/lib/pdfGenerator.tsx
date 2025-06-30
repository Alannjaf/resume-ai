import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { ResumeData } from '../types/resume'
import { getTemplate } from './getTemplate'
import { generateWatermarkedPDF } from './watermarkedTemplate'

// Browser detection utility
const detectBrowser = () => {
  const _userAgent = navigator.userAgent.toLowerCase()
  if (_userAgent.includes('edg/')) return 'edge'
  if (_userAgent.includes('chrome') && !_userAgent.includes('edg/')) return 'chrome'
  if (_userAgent.includes('firefox')) return 'firefox'
  if (_userAgent.includes('safari') && !_userAgent.includes('chrome')) return 'safari'
  return 'unknown'
}

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

export const generateResumePDF = async (resumeData: ResumeData, fileName?: string, template: string = 'modern', withWatermark = false) => {
  try {
    let blob: Blob;
    
    if (withWatermark) {
      const watermarkedPDFBytes = await generateWatermarkedPDF(template, resumeData);
      blob = new Blob([watermarkedPDFBytes], { type: 'application/pdf' });
    } else {
      const templateComponent = getTemplate(template, resumeData);
      if (!templateComponent) {
        throw new Error('Template component could not be generated');
      }
      blob = await pdf(templateComponent).toBlob();
    }
    
    const defaultFileName = `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    const finalFileName = fileName || defaultFileName
    
    // Use Safari-specific download for Safari, regular saveAs for other browsers
    const browser = detectBrowser()
    if (browser === 'safari') {
      downloadBlobSafari(blob, finalFileName)
    } else {
      saveAs(blob, finalFileName)
    }
    
    return true
  } catch {
    // Error generating PDF
    throw new Error('Failed to generate PDF')
  }
}

export const getResumePDFBlob = async (resumeData: ResumeData, template: string = 'modern', withWatermark = false) => {
  try {
    if (withWatermark) {
      const watermarkedPDFBytes = await generateWatermarkedPDF(template, resumeData);
      return new Blob([watermarkedPDFBytes], { type: 'application/pdf' });
    } else {
      const templateComponent = getTemplate(template, resumeData);
      if (!templateComponent) {
        throw new Error('Template component could not be generated');
      }
      return await pdf(templateComponent).toBlob();
    }
  } catch {
    // Error generating PDF blob
    throw new Error('Failed to generate PDF blob')
  }
}