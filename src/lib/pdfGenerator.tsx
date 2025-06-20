import React from 'react'
import { pdf } from '@react-pdf/renderer'
import { saveAs } from 'file-saver'
import { ResumeData } from '../types/resume'
import EnhancedModernTemplate from '../components/resume-pdf/EnhancedModernTemplate'
import { CreativeTemplate } from '../components/resume-pdf/CreativeTemplate'
import { ExecutiveProfessionalTemplate } from '../components/resume-pdf/ExecutiveProfessionalTemplate'

const getTemplate = (template: string, data: ResumeData) => {
  switch (template) {
    case 'creative':
      return <CreativeTemplate data={data} />
    case 'executive':
      return <ExecutiveProfessionalTemplate data={data} />
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
    saveAs(blob, fileName || defaultFileName)
    return true
  } catch (error) {
    console.error('Error generating PDF:', error)
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
  } catch (error) {
    console.error('Error generating PDF blob:', error)
    throw new Error('Failed to generate PDF blob')
  }
}