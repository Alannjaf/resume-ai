import React from 'react'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { ResumeData } from '../types/resume'

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
import EnhancedModernTemplate from '../components/resume-pdf/EnhancedModernTemplate'
import { CreativeTemplate } from '../components/resume-pdf/CreativeTemplate'
import { ExecutiveProfessionalTemplate } from '../components/resume-pdf/ExecutiveProfessionalTemplate'
import { ElegantProfessionalTemplate } from '../components/resume-pdf/ElegantProfessionalTemplate'
import { MinimalistModernTemplate } from '../components/resume-pdf/MinimalistModernTemplate'
import { CreativeArtisticTemplate } from '../components/resume-pdf/CreativeArtisticTemplate'
import { DeveloperTemplate } from '../components/resume-pdf/DeveloperTemplate'

const getTemplate = (template: string, data: ResumeData) => {
  switch (template) {
    case 'creative':
      return <CreativeTemplate data={data} />
    case 'executive':
      return <ExecutiveProfessionalTemplate data={data} />
    case 'elegant':
      return <ElegantProfessionalTemplate data={data} />
    case 'minimalist':
      return <MinimalistModernTemplate data={data} />
    case 'creative-artistic':
      return <CreativeArtisticTemplate data={data} />
    case 'developer':
      return <DeveloperTemplate data={data} />
    case 'modern':
    default:
      return <EnhancedModernTemplate data={data} />
  }
}

export const generateResumePDF = async (resumeData: ResumeData, fileName?: string, template: string = 'modern') => {
  try {
    const templateComponent = getTemplate(template, resumeData)
    if (!templateComponent) {
      throw new Error('Template component could not be generated')
    }
    const blob = await pdf(templateComponent).toBlob()
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

export const getResumePDFBlob = async (resumeData: ResumeData, template: string = 'modern') => {
  try {
    const templateComponent = getTemplate(template, resumeData)
    if (!templateComponent) {
      throw new Error('Template component could not be generated')
    }
    const blob = await pdf(templateComponent).toBlob()
    return blob
  } catch {
    // Error generating PDF blob
    throw new Error('Failed to generate PDF blob')
  }
}