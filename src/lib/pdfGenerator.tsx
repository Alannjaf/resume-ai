import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { ResumeData } from '../types/resume'
import { getTemplate } from './getTemplate'
import { generateWatermarkedPDF } from './watermarkedTemplate'
import { detectBrowser, downloadBlobSafari } from './browser-utils'

export const generateResumePDF = async (
  resumeData: ResumeData,
  fileName?: string,
  template: string = 'modern',
  withWatermark = false
) => {
  try {
    let blob: Blob

    if (withWatermark) {
      const watermarkedPDFBytes = await generateWatermarkedPDF(template, resumeData)
      blob = new Blob([watermarkedPDFBytes], { type: 'application/pdf' })
    } else {
      const templateComponent = getTemplate(template, resumeData)
      if (!templateComponent) {
        throw new Error('Template component could not be generated')
      }
      blob = await pdf(templateComponent).toBlob()
    }

    const defaultFileName = `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    const finalFileName = fileName || defaultFileName

    const browser = detectBrowser()
    if (browser === 'safari') {
      downloadBlobSafari(blob, finalFileName)
    } else {
      saveAs(blob, finalFileName)
    }

    return true
  } catch {
    throw new Error('Failed to generate PDF')
  }
}

export const getResumePDFBlob = async (
  resumeData: ResumeData,
  template: string = 'modern',
  withWatermark = false
) => {
  try {
    if (withWatermark) {
      const watermarkedPDFBytes = await generateWatermarkedPDF(template, resumeData)
      return new Blob([watermarkedPDFBytes], { type: 'application/pdf' })
    } else {
      const templateComponent = getTemplate(template, resumeData)
      if (!templateComponent) {
        throw new Error('Template component could not be generated')
      }
      return await pdf(templateComponent).toBlob()
    }
  } catch {
    throw new Error('Failed to generate PDF blob')
  }
}
