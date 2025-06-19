import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { ResumeData } from '../types/resume'
import EnhancedModernTemplate from '../components/resume-pdf/EnhancedModernTemplate'

export const generateResumePDF = async (resumeData: ResumeData, fileName?: string) => {
  try {
    const blob = await pdf(EnhancedModernTemplate({ data: resumeData })).toBlob()
    const defaultFileName = `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    saveAs(blob, fileName || defaultFileName)
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF')
  }
}

export const getResumePDFBlob = async (resumeData: ResumeData) => {
  try {
    const blob = await pdf(EnhancedModernTemplate({ data: resumeData })).toBlob()
    return blob
  } catch (error) {
    console.error('Error generating PDF blob:', error)
    throw new Error('Failed to generate PDF blob')
  }
}