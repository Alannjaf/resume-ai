import { useState, useCallback } from 'react'
import { ResumeData } from '@/types/resume'

export function useResumeData(initialData?: ResumeData) {
  const [formData, setFormData] = useState<ResumeData>(initialData || {
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
    certifications: []
  })

  const updatePersonalField = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }))
  }, [])

  const updateSummary = useCallback((summary: string) => {
    setFormData(prev => ({
      ...prev,
      summary
    }))
  }, [])

  const updateSection = useCallback((section: keyof ResumeData, data: unknown) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }))
  }, [])

  return {
    formData,
    setFormData,
    updatePersonalField,
    updateSummary,
    updateSection
  }
}