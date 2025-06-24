'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AppHeader } from '@/components/shared/AppHeader'
import { ArrowLeft, ArrowRight, Save, Eye } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { WorkExperienceForm } from '@/components/resume-builder/WorkExperienceForm'
import { EducationForm } from '@/components/resume-builder/EducationForm'
import { SkillsForm } from '@/components/resume-builder/SkillsForm'
import { LanguagesForm } from '@/components/resume-builder/LanguagesForm'
import { ProjectsForm } from '@/components/resume-builder/ProjectsForm'
import { CertificationsForm } from '@/components/resume-builder/CertificationsForm'
import { PreviewModal } from '@/components/resume-builder/PreviewModal'
import { TemplateGallery } from '@/components/resume-builder/TemplateGallery'
import { AIProfessionalSummary } from '@/components/ai/AIProfessionalSummary'
import { TranslateAndEnhanceButton } from '@/components/ai/TranslateAndEnhanceButton'
import ImageUploader from '@/components/resume-builder/ImageUploader'
import { ResumeData } from '@/types/resume'
import { isNonEnglishContent } from '@/lib/languageDetection'
import { scrollToTopForSectionChange, scrollToTopAfterAsync } from '@/lib/scrollUtils'
import toast from 'react-hot-toast'

// Form sections
const getFormSections = (t: any) => [
  { id: 'personal', title: t('pages.resumeBuilder.sections.personalInfo'), icon: '👤' },
  { id: 'summary', title: t('pages.resumeBuilder.sections.professionalSummary'), icon: '📝' },
  { id: 'experience', title: t('pages.resumeBuilder.sections.workExperience'), icon: '💼' },
  { id: 'education', title: t('pages.resumeBuilder.sections.education'), icon: '🎓' },
  { id: 'skills', title: t('pages.resumeBuilder.sections.skills'), icon: '⚡' },
  { id: 'languages', title: t('pages.resumeBuilder.sections.languages'), icon: '🌐' },
  { id: 'projects', title: t('pages.resumeBuilder.sections.projects'), icon: '💻' },
  { id: 'certifications', title: t('pages.resumeBuilder.sections.certifications'), icon: '🏆' },
  { id: 'template', title: t('pages.resumeBuilder.sections.chooseTemplate'), icon: '🎨' },
]

function ResumeBuilderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const { permissions, checkPermission, isLoading: subscriptionLoading } = useSubscription()
  const [currentSection, setCurrentSection] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [resumeTitle, setResumeTitle] = useState('')
  const [lastSavedData, setLastSavedData] = useState<ResumeData | null>(null)
  const [saveQueue, setSaveQueue] = useState<NodeJS.Timeout | null>(null)
  const [isAutoTranslating, setIsAutoTranslating] = useState(false)
  const [formData, setFormData] = useState<ResumeData>({
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: '',
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    languages: [],
    projects: [],
    certifications: [],
  })

  // Quick save function with debouncing
  const quickSave = async (changes: any, sectionType?: string) => {
    if (!resumeId) {
      // If no resume exists yet, create it first
      try {
        const response = await fetch('/api/resumes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: resumeTitle,
            template: selectedTemplate,
            formData
          })
        })

        if (!response.ok) {
          throw new Error(t('pages.resumeBuilder.errors.createFailed'))
        }

        const data = await response.json()
        setResumeId(data.resume.id)
        setLastSavedData({ ...formData })
        return true
      } catch (error) {
        console.error('Create resume failed:', error)
        return false
      }
    }

    try {
      const response = await fetch(`/api/resumes/${resumeId}/quick-save`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          changes,
          currentSection: sectionType
        })
      })

      if (!response.ok) {
        throw new Error(t('pages.resumeBuilder.errors.saveFailed'))
      }

      // Update last saved data
      setLastSavedData({ ...formData })
      return true
    } catch (error) {
      console.error('Quick save failed:', error)
      return false
    }
  }

  // Detect changes and queue save
  const queueSave = (sectionType?: string) => {
    // If no baseline data exists yet, initialize it
    if (!lastSavedData) {
      setLastSavedData({ ...formData })
      return
    }

    const changes: any = {}
    let hasChanges = false

    // Always include title in changes for save operations
    changes.title = resumeTitle

    if (JSON.stringify(formData.personal) !== JSON.stringify(lastSavedData.personal)) {
      changes.personal = formData.personal
      hasChanges = true
    }

    if (formData.summary !== lastSavedData.summary) {
      changes.summary = formData.summary
      hasChanges = true
    }

    // Check section-specific changes
    if (sectionType) {
      const currentSectionData = (formData as any)[sectionType]
      const lastSectionData = (lastSavedData as any)[sectionType]
      
      if (JSON.stringify(currentSectionData) !== JSON.stringify(lastSectionData)) {
        changes.sectionData = currentSectionData
        hasChanges = true
      }
    }

    if (hasChanges) {
      // Clear existing save queue
      if (saveQueue) {
        clearTimeout(saveQueue)
      }

      // Queue new save with debounce
      const timeoutId = setTimeout(() => {
        setIsAutoSaving(true)
        quickSave(changes, sectionType).finally(() => {
          setIsAutoSaving(false)
        })
      }, 500) // 500ms debounce

      setSaveQueue(timeoutId)
    }
  }

  // Auto-translate all non-English content to English
  const autoTranslateToEnglish = async (): Promise<ResumeData> => {
    const translatedData = { ...formData }
    let hasTranslations = false

    try {
      // Collect all content that needs translation
      const translationTasks: Array<{
        content: string
        contentType: string
        contextInfo?: any
        updatePath: string[]
        index?: number
      }> = []

      // Personal information
      if (formData.personal.fullName && isNonEnglishContent(formData.personal.fullName)) {
        translationTasks.push({
          content: formData.personal.fullName,
          contentType: 'personal',
          updatePath: ['personal', 'fullName']
        })
      }

      if (formData.personal.title && isNonEnglishContent(formData.personal.title)) {
        translationTasks.push({
          content: formData.personal.title,
          contentType: 'personal',
          updatePath: ['personal', 'title']
        })
      }

      if (formData.personal.location && isNonEnglishContent(formData.personal.location)) {
        translationTasks.push({
          content: formData.personal.location,
          contentType: 'personal',
          updatePath: ['personal', 'location']
        })
      }

      // Professional summary
      if (formData.summary && isNonEnglishContent(formData.summary)) {
        translationTasks.push({
          content: formData.summary,
          contentType: 'summary',
          updatePath: ['summary']
        })
      }

      // Work experience
      formData.experience.forEach((exp, i) => {
        if (exp.jobTitle && isNonEnglishContent(exp.jobTitle)) {
          translationTasks.push({
            content: exp.jobTitle,
            contentType: 'personal',
            contextInfo: { company: exp.company },
            updatePath: ['experience', 'jobTitle'],
            index: i
          })
        }

        if (exp.company && isNonEnglishContent(exp.company)) {
          translationTasks.push({
            content: exp.company,
            contentType: 'personal',
            updatePath: ['experience', 'company'],
            index: i
          })
        }

        if (exp.location && isNonEnglishContent(exp.location)) {
          translationTasks.push({
            content: exp.location,
            contentType: 'personal',
            updatePath: ['experience', 'location'],
            index: i
          })
        }

        if (exp.description && isNonEnglishContent(exp.description)) {
          translationTasks.push({
            content: exp.description,
            contentType: 'description',
            contextInfo: { jobTitle: exp.jobTitle, company: exp.company },
            updatePath: ['experience', 'description'],
            index: i
          })
        }
      })

      // Education
      formData.education.forEach((edu, i) => {
        if (edu.degree && isNonEnglishContent(edu.degree)) {
          translationTasks.push({
            content: edu.degree,
            contentType: 'personal',
            updatePath: ['education', 'degree'],
            index: i
          })
        }

        if (edu.field && isNonEnglishContent(edu.field)) {
          translationTasks.push({
            content: edu.field,
            contentType: 'personal',
            updatePath: ['education', 'field'],
            index: i
          })
        }

        if (edu.school && isNonEnglishContent(edu.school)) {
          translationTasks.push({
            content: edu.school,
            contentType: 'personal',
            updatePath: ['education', 'school'],
            index: i
          })
        }

        if (edu.location && isNonEnglishContent(edu.location)) {
          translationTasks.push({
            content: edu.location,
            contentType: 'personal',
            updatePath: ['education', 'location'],
            index: i
          })
        }

        if (edu.achievements && isNonEnglishContent(edu.achievements)) {
          translationTasks.push({
            content: edu.achievements,
            contentType: 'description',
            updatePath: ['education', 'achievements'],
            index: i
          })
        }
      })

      // Skills
      formData.skills.forEach((skill, i) => {
        if (skill.name && isNonEnglishContent(skill.name)) {
          translationTasks.push({
            content: skill.name,
            contentType: 'personal',
            updatePath: ['skills', 'name'],
            index: i
          })
        }
      })

      // Languages
      formData.languages.forEach((language, i) => {
        if (language.name && isNonEnglishContent(language.name)) {
          translationTasks.push({
            content: language.name,
            contentType: 'personal',
            updatePath: ['languages', 'name'],
            index: i
          })
        }
      })

      // Projects
      if (formData.projects) {
        formData.projects.forEach((project, i) => {
          if (project.name && isNonEnglishContent(project.name)) {
            translationTasks.push({
              content: project.name,
              contentType: 'personal',
              updatePath: ['projects', 'name'],
              index: i
            })
          }

          if (project.description && isNonEnglishContent(project.description)) {
            translationTasks.push({
              content: project.description,
              contentType: 'project',
              contextInfo: { projectName: project.name },
              updatePath: ['projects', 'description'],
              index: i
            })
          }

          if (project.technologies && isNonEnglishContent(project.technologies)) {
            translationTasks.push({
              content: project.technologies,
              contentType: 'personal',
              updatePath: ['projects', 'technologies'],
              index: i
            })
          }
        })
      }

      // Certifications
      if (formData.certifications) {
        formData.certifications.forEach((cert, i) => {
          if (cert.name && isNonEnglishContent(cert.name)) {
            translationTasks.push({
              content: cert.name,
              contentType: 'personal',
              updatePath: ['certifications', 'name'],
              index: i
            })
          }

          if (cert.issuer && isNonEnglishContent(cert.issuer)) {
            translationTasks.push({
              content: cert.issuer,
              contentType: 'personal',
              updatePath: ['certifications', 'issuer'],
              index: i
            })
          }
        })
      }

      if (translationTasks.length === 0) {
        console.log('No translation tasks found')
        return formData // No translation needed
      }

      console.log(`Found ${translationTasks.length} items to translate:`, translationTasks.map(t => ({ content: t.content.substring(0, 30) + '...', type: t.contentType })))

      // Process translations in smaller batches of 3 to avoid overwhelming the API
      const batchSize = 3
      for (let i = 0; i < translationTasks.length; i += batchSize) {
        const batch = translationTasks.slice(i, i + batchSize)
        console.log(`Processing translation batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(translationTasks.length/batchSize)}`)
        
        // Process batch in parallel
        const batchPromises = batch.map(task => 
          fetch('/api/ai/translate-enhance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: task.content,
              contentType: task.contentType,
              contextInfo: task.contextInfo
            })
          }).then(async response => {
            if (response.ok) {
              const result = await response.json()
              console.log(`Translated: "${task.content.substring(0, 30)}..." -> "${result.enhancedContent.substring(0, 30)}..."`)
              return { ...task, translatedContent: result.enhancedContent }
            } else {
              console.error(`Translation failed for: "${task.content.substring(0, 30)}..." - Status: ${response.status}`)
              return null
            }
          }).catch(error => {
            console.error(`Translation error for: "${task.content.substring(0, 30)}..."`, error)
            return null
          })
        )

        const batchResults = await Promise.all(batchPromises)

        // Apply translations
        batchResults.forEach(result => {
          if (result?.translatedContent) {
            const { updatePath, index, translatedContent } = result
            console.log(`Applying translation to ${updatePath.join('.')}${index !== undefined ? `[${index}]` : ''}`)
            
            if (updatePath.length === 2 && typeof index === 'number') {
              // Array item update (experience, education, skills, etc.)
              const [section, field] = updatePath
              if (translatedData[section as keyof ResumeData] && Array.isArray(translatedData[section as keyof ResumeData])) {
                (translatedData[section as keyof ResumeData] as any)[index][field] = translatedContent
                hasTranslations = true
                console.log(`Updated ${section}[${index}].${field}`)
              }
            } else if (updatePath.length === 2) {
              // Nested object update (personal info)
              const [section, field] = updatePath
              if (translatedData[section as keyof ResumeData]) {
                (translatedData[section as keyof ResumeData] as any)[field] = translatedContent
                hasTranslations = true
                console.log(`Updated ${section}.${field}`)
              }
            } else if (updatePath.length === 1) {
              // Direct field update (summary)
              const [field] = updatePath
              translatedData[field as keyof ResumeData] = translatedContent as any
              hasTranslations = true
              console.log(`Updated ${field}`)
            }
          }
        })
      }

      if (hasTranslations) {
        toast.success(t('pages.resumeBuilder.messages.autoTranslated'))
      }

      return translatedData
    } catch (error) {
      console.error('Auto-translation error:', error)
      toast.error(t('pages.resumeBuilder.messages.translationError'))
      return formData // Return original data if translation fails
    }
  }

  const FORM_SECTIONS = getFormSections(t)
  
  const handleNext = async () => {
    if (currentSection < FORM_SECTIONS.length - 1) {
      // Check if we're moving to template selection (section 8)
      const nextSection = currentSection + 1
      const isMovingToTemplateSelection = nextSection === 8

      if (isMovingToTemplateSelection) {
        // Auto-translate all content to English before template selection
        setIsAutoTranslating(true)
        
        try {
          console.log('Starting auto-translation...')
          const translatedData = await autoTranslateToEnglish()
          console.log('Translation completed, updating form data...')
          setFormData(translatedData)
          
          // Force save the translated data immediately
          if (resumeId) {
            console.log('Saving translated data...')
            await fetch(`/api/resumes/${resumeId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: resumeTitle,
                template: selectedTemplate,
                formData: translatedData
              })
            })
            console.log('Translated data saved successfully')
          }
        } catch (error) {
          console.error('Auto-translation failed:', error)
          toast.error(t('pages.resumeBuilder.messages.translationError'))
        } finally {
          setIsAutoTranslating(false)
        }
      }

      // Move to next section
      setCurrentSection(nextSection)
      
      // Improved scroll to top with proper timing
      if (isMovingToTemplateSelection) {
        // After async operations, use special scroll function
        await scrollToTopAfterAsync()
      } else {
        // Regular section change scroll
        await scrollToTopForSectionChange()
      }

      // Save current section data in background
      const sectionKey = getSectionKey(currentSection)
      if (sectionKey) {
        queueSave(sectionKey)
      }
    }
  }

  // Helper function to get section key from index
  const getSectionKey = (sectionIndex: number): string | undefined => {
    const sectionMap: Record<number, string> = {
      0: 'personal',
      1: 'summary', 
      2: 'experience',
      3: 'education',
      4: 'skills',
      5: 'languages',
      6: 'projects',
      7: 'certifications'
    }
    return sectionMap[sectionIndex]
  }

  const handlePrevious = async () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      await scrollToTopForSectionChange()
    }
  }

  const handleSave = async (showToast = true) => {
    setIsSaving(true)
    try {
      const endpoint = resumeId ? `/api/resumes/${resumeId}` : '/api/resumes'
      const method = resumeId ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: resumeTitle,
          template: selectedTemplate,
          formData
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || t('pages.resumeBuilder.messages.saveError'))
      }

      const data = await response.json()
      
      if (!resumeId) {
        setResumeId(data.resume.id)
      }

      // Show success message only if requested
      if (showToast) {
        toast.success(t('pages.resumeBuilder.messages.saveSuccess'))
      }
      
      return true // Return success status
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('pages.resumeBuilder.messages.saveError'))
      return false // Return failure status
    } finally {
      setIsSaving(false)
    }
  }

  const handleSectionChange = async (newSection: number) => {
    if (newSection === currentSection) return
    
    // Change section immediately (optimistic update)
    const oldSection = currentSection
    setCurrentSection(newSection)
    await scrollToTopForSectionChange()

    // Save old section data in background
    const sectionKey = getSectionKey(oldSection)
    if (sectionKey) {
      queueSave(sectionKey)
    }
  }

  // Initialize default title when translations are ready
  useEffect(() => {
    if (!resumeTitle && t) {
      setResumeTitle(t('pages.resumeBuilder.defaults.resumeTitle'))
    }
  }, [t, resumeTitle])

  // Initialize lastSavedData for new resumes to enable auto-save
  useEffect(() => {
    const id = searchParams.get('id')
    const importedData = sessionStorage.getItem('importedResumeData')
    
    // Only initialize for truly new resumes (no ID, no import, no existing lastSavedData)
    if (!id && !importedData && !lastSavedData && !resumeId) {
      setLastSavedData({ ...formData })
    }
  }, [searchParams, lastSavedData, resumeId, formData])


  // Load resume data if editing existing resume or importing
  useEffect(() => {
    const loadResume = async () => {
      // Check for imported resume data first
      const importedData = sessionStorage.getItem('importedResumeData')
      const importedTitle = sessionStorage.getItem('importedResumeTitle')
      
      if (importedData && !searchParams.get('id')) {
        try {
          const parsedData = JSON.parse(importedData) as ResumeData
          const title = importedTitle || t('pages.resumeBuilder.defaults.importedTitle')
          setFormData(parsedData)
          setLastSavedData({ ...parsedData }) // Set initial baseline for change detection
          setResumeTitle(title)
          
          // Clear session storage
          sessionStorage.removeItem('importedResumeData')
          sessionStorage.removeItem('importedResumeTitle')
          
          toast.success(t('pages.resumeBuilder.messages.importSuccess'))
          return
        } catch (error) {
          // Error parsing imported data
        }
      }

      const id = searchParams.get('id')
      if (!id) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/resumes/${id}`)
        if (!response.ok) {
          throw new Error(t('pages.resumeBuilder.messages.loadError'))
        }

        const data = await response.json()
        const resume = data.resume

        setResumeId(resume.id)
        setResumeTitle(resume.title)
        setSelectedTemplate(resume.template || 'modern')
        
        // Ensure all items have IDs
        let idCounter = 0
        const generateId = () => `${Date.now()}_${++idCounter}`
        
        const formDataWithIds: ResumeData = {
          ...resume.formData,
          experience: resume.formData.experience.map((exp: any) => ({
            ...exp,
            id: exp.id || generateId()
          })),
          education: resume.formData.education.map((edu: any) => ({
            ...edu,
            id: edu.id || generateId()
          })),
          skills: resume.formData.skills.map((skill: any) => ({
            ...skill,
            id: skill.id || generateId()
          })),
          languages: resume.formData.languages.map((lang: any) => ({
            ...lang,
            id: lang.id || generateId()
          })),
          projects: (resume.formData.projects || []).map((proj: any) => ({
            ...proj,
            id: proj.id || generateId()
          })),
          certifications: (resume.formData.certifications || []).map((cert: any) => ({
            ...cert,
            id: cert.id || generateId()
          }))
        }
        
        setFormData(formDataWithIds)
        setLastSavedData({ ...formDataWithIds }) // Set initial baseline for change detection
        
        // Check if preview should be opened automatically
        const shouldPreview = searchParams.get('preview')
        if (shouldPreview === 'true') {
          setShowPreview(true)
        }
      } catch (error) {
        toast.error(t('pages.resumeBuilder.messages.loadError'))
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadResume()
  }, [searchParams, router])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveQueue) {
        clearTimeout(saveQueue)
      }
    }
  }, [saveQueue])

  // Auto-save functionality (optional) - commented out to avoid dependency issues
  // useEffect(() => {
  //   if (!resumeId) return
  //   const autoSave = setTimeout(() => {
  //     handleSave()
  //   }, 30000)
  //   return () => clearTimeout(autoSave)
  // }, [formData, resumeId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p>{t('pages.resumeBuilder.loading.resume')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title={t('pages.resumeBuilder.title')}
        showBackButton={true}
        backButtonText={t('pages.resumeBuilder.backToDashboard')}
        backButtonHref="/dashboard"
      />
      
      {/* Resume Controls Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Resume Title */}
            <div className="flex flex-col">
              <label htmlFor="resume-title" className="text-sm font-medium text-gray-700 mb-1">
                {t('pages.resumeBuilder.resumeTitle')}
              </label>
              <input
                id="resume-title"
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={t('pages.resumeBuilder.resumeTitlePlaceholder')}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {t('pages.resumeBuilder.actions.preview')}
              </Button>
              <Button 
                onClick={() => handleSave(true)} 
                size="sm"
                disabled={isSaving || isAutoSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    {t('pages.resumeBuilder.actions.saving')}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t('pages.resumeBuilder.actions.save')}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">{t('pages.resumeBuilder.progress')}</h2>
              <div className="space-y-3">
                {FORM_SECTIONS.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => handleSectionChange(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                      index === currentSection
                        ? 'bg-primary text-primary-foreground'
                        : index < currentSection
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-xl">{section.icon}</span>
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Form Content */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  {FORM_SECTIONS[currentSection].title}
                </h2>
                {isAutoSaving && (
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="animate-spin h-3 w-3 mr-1 border-2 border-gray-400 border-t-transparent rounded-full" />
                    {t('pages.resumeBuilder.actions.saving')}
                  </div>
                )}
              </div>

              {/* Personal Information Section */}
              {currentSection === 0 && (
                <div className="space-y-6">
                  {/* Profile Image Upload - Only show if user has permission */}
                  {checkPermission('canUploadPhoto') ? (
                    <div className="flex justify-center">
                      <ImageUploader
                        currentImage={formData.personal.profileImage}
                        originalImage={formData.personal.originalProfileImage}
                        cropData={formData.personal.profileImageCrop}
                        templateId={selectedTemplate}
                        onImageUpload={(imageDataUrl, originalImage) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              profileImage: imageDataUrl,
                              originalProfileImage: originalImage || imageDataUrl,
                            },
                          })
                        }
                        onImageRemove={() =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              profileImage: undefined,
                              originalProfileImage: undefined,
                              profileImageCrop: undefined,
                            },
                          })
                        }
                        onCropUpdate={(croppedImage, cropData) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              profileImage: croppedImage,
                              profileImageCrop: cropData,
                            },
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-gray-400 mb-2">📷</div>
                        <p className="text-sm text-gray-600">{t('forms.personalInfo.photoUpgrade.title')}</p>
                        <p className="text-xs text-gray-500 mt-1">{t('forms.personalInfo.photoUpgrade.description')}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t('forms.personalInfo.fields.fullName')} *
                      </label>
                      <Input
                        placeholder={t('forms.personalInfo.placeholders.fullName')}
                        value={formData.personal.fullName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              fullName: e.target.value,
                            },
                          })
                        }
                      />
                      <TranslateAndEnhanceButton
                        content={formData.personal.fullName}
                        contentType="personal"
                        onAccept={(enhancedName) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              fullName: enhancedName,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t('forms.personalInfo.fields.professionalTitle')}
                      </label>
                      <Input
                        placeholder={t('forms.personalInfo.placeholders.professionalTitle')}
                        value={formData.personal.title || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              title: e.target.value,
                            },
                          })
                        }
                      />
                      <TranslateAndEnhanceButton
                        content={formData.personal.title || ''}
                        contentType="personal"
                        onAccept={(enhancedTitle) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              title: enhancedTitle,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t('forms.personalInfo.fields.email')} *
                      </label>
                      <Input
                        type="email"
                        placeholder={t('forms.personalInfo.placeholders.email')}
                        value={formData.personal.email}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t('forms.personalInfo.fields.phone')}
                      </label>
                      <Input
                        placeholder={t('forms.personalInfo.placeholders.phone')}
                        value={formData.personal.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              phone: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t('forms.personalInfo.fields.location')}
                      </label>
                      <Input
                        placeholder={t('forms.personalInfo.placeholders.location')}
                        value={formData.personal.location}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              location: e.target.value,
                            },
                          })
                        }
                      />
                      <TranslateAndEnhanceButton
                        content={formData.personal.location}
                        contentType="personal"
                        onAccept={(enhancedLocation) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              location: enhancedLocation,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t('forms.personalInfo.fields.linkedin')}
                      </label>
                      <Input
                        placeholder={t('forms.personalInfo.placeholders.linkedin')}
                        value={formData.personal.linkedin}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              linkedin: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t('forms.personalInfo.fields.website')}
                      </label>
                      <Input
                        placeholder={t('forms.personalInfo.placeholders.website')}
                        value={formData.personal.website}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              website: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Summary Section */}
              {currentSection === 1 && (
                <div className="space-y-4">
                  {/* AI Section First - Highlighted */}
                  <div className="relative">
                    {/* Attention-grabbing header */}
                    <div className="absolute -top-3 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                      {t('pages.resumeBuilder.ai.powered')}
                    </div>
                    
                    {/* AI Professional Summary Generator */}
                    <AIProfessionalSummary
                      currentSummary={formData.summary}
                      onAccept={(summary) => setFormData({ ...formData, summary })}
                      personalInfo={formData.personal}
                      experience={formData.experience}
                      skills={formData.skills}
                    />
                  </div>

                  {/* Divider with "OR" */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">{t('pages.resumeBuilder.ai.orWriteManually')}</span>
                    </div>
                  </div>

                  {/* Manual Input Section */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('forms.professionalSummary.title')}
                    </label>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={6}
                      placeholder={t('forms.professionalSummary.placeholder')}
                      value={formData.summary}
                      onChange={(e) =>
                        setFormData({ ...formData, summary: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>{t('common.tip')}:</strong> {t('forms.professionalSummary.tip')}
                    </p>
                  </div>
                </div>
              )}

              {/* Work Experience Section */}
              {currentSection === 2 && (
                <WorkExperienceForm
                  experiences={formData.experience}
                  onChange={(experience) => setFormData({ ...formData, experience })}
                />
              )}

              {/* Education Section */}
              {currentSection === 3 && (
                <EducationForm
                  education={formData.education}
                  onChange={(education) => setFormData({ ...formData, education })}
                />
              )}

              {/* Skills Section */}
              {currentSection === 4 && (
                <SkillsForm
                  skills={formData.skills}
                  onChange={(skills) => setFormData({ ...formData, skills })}
                  experience={formData.experience}
                />
              )}

              {/* Languages Section */}
              {currentSection === 5 && (
                <LanguagesForm
                  languages={formData.languages}
                  onChange={(languages) => setFormData({ ...formData, languages })}
                />
              )}

              {/* Projects Section */}
              {currentSection === 6 && (
                <ProjectsForm
                  projects={formData.projects || []}
                  onChange={(projects) => setFormData({ ...formData, projects })}
                />
              )}

              {/* Certifications Section */}
              {currentSection === 7 && (
                <CertificationsForm
                  certifications={formData.certifications || []}
                  onChange={(certifications) => setFormData({ ...formData, certifications })}
                />
              )}

              {/* Template Selection Section */}
              {currentSection === 8 && (
                <div className="space-y-6">
                  <TemplateGallery
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={setSelectedTemplate}
                  />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentSection === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('pages.resumeBuilder.actions.previous')}
                </Button>
                {currentSection === FORM_SECTIONS.length - 1 ? (
                  <Button onClick={() => setShowPreview(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {t('pages.resumeBuilder.actions.viewResume')}
                  </Button>
                ) : (
                  <Button onClick={handleNext} disabled={isAutoTranslating}>
                    {isAutoTranslating && currentSection === 7 ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        {t('pages.resumeBuilder.actions.translating')}
                      </>
                    ) : (
                      <>
                        {t('pages.resumeBuilder.actions.next')}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Progress Section for Mobile - Shown only on mobile */}
        <div className="lg:hidden mt-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('pages.resumeBuilder.progress')}</h2>
            <div className="space-y-3">
              {FORM_SECTIONS.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors flex items-center space-x-3 ${
                    index === currentSection
                      ? 'bg-primary text-primary-foreground'
                      : index < currentSection
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{section.icon}</span>
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={formData}
        template={selectedTemplate}
      />
    </div>
  )
}

function LoadingFallback() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p>{t('pages.resumeBuilder.loading.builder')}</p>
      </div>
    </div>
  )
}

export default function ResumeBuilder() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResumeBuilderContent />
    </Suspense>
  )
}