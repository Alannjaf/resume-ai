'use client'

import { useEffect, useRef, Suspense, useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AppHeader } from '@/components/shared/AppHeader'
import { ArrowLeft, Save, Eye, Keyboard, ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { NavigationIndicator } from '@/components/ui/navigation-indicator'
import { KeyboardShortcutsHelp } from '@/components/ui/keyboard-shortcuts-help'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSubscription } from '@/contexts/SubscriptionContext'
import { FormSectionRenderer, FormSectionRendererRef } from '@/components/resume-builder/sections/FormSectionRenderer'
import { useResumeData } from '@/hooks/useResumeData'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useAutoTranslation } from '@/hooks/useAutoTranslation'
import { scrollToTopForSectionChange, scrollToTopAfterAsync } from '@/lib/scrollUtils'
import toast from 'react-hot-toast'

// Dynamic imports for heavy components
const PreviewModal = dynamic(() => import('@/components/resume-builder/PreviewModal').then(mod => ({ default: mod.PreviewModal })), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 flex flex-col items-center">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mb-4" />
        <p className="text-gray-600">Loading PDF preview...</p>
      </div>
    </div>
  )
})

// Form sections configuration
const getFormSections = (t: (key: string) => string) => [
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
  const { checkPermission } = useSubscription()
  
  // State management
  const [currentSection, setCurrentSection] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [resumeTitle, setResumeTitle] = useState('')
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false)
  
  // Refs
  const summaryTextareaRef = useRef<HTMLTextAreaElement>(null)
  const formSectionRef = useRef<FormSectionRendererRef>(null) // Reference to current form section for forced updates

  // Custom hooks
  const { formData, setFormData, updatePersonalField, updateSummary, updateSection } = useResumeData()
  const { isAutoSaving, queueSave, setLastSavedData } = useAutoSave({
    resumeId,
    setResumeId,
    formData,
    selectedTemplate,
    resumeTitle
  })
  const { isAutoTranslating, setIsAutoTranslating, autoTranslateToEnglish, hasNonEnglishContent } = useAutoTranslation()

  // Form sections
  const formSections = getFormSections(t)

  // Navigation handlers
  const handleNext = useCallback(async () => {
    if (currentSection < formSections.length - 1) {
      const nextSection = currentSection + 1
      
      // Force save current section data before navigation using section renderer ref
      if (formSectionRef.current) {
        formSectionRef.current.triggerSectionSave()
      }
      
      // Also trigger a direct save to ensure current state is captured
      queueSave(`section_${currentSection}`)
      
      // Progressive auto-translation: only translate if there's non-English content
      // Skip translation for template section (index 8) as there's no content to translate
      if (currentSection < 8 && hasNonEnglishContent(formData)) {
        setIsAutoTranslating(true)
        
        try {
          const translatedData = await autoTranslateToEnglish(formData)
          setFormData(translatedData)
          
          // Force save the translated data immediately
          if (resumeId) {
            await fetch(`/api/resumes/${resumeId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: resumeTitle,
                template: selectedTemplate,
                formData: translatedData
              })
            })
          }
        } catch (error) {
          console.error('Translation error:', error)
          toast.error(t('pages.resumeBuilder.messages.translationError'))
        } finally {
          setIsAutoTranslating(false)
        }
      }
      
      setCurrentSection(nextSection)
      
      // Improved scroll to top with proper timing
      if (currentSection < 8 && hasNonEnglishContent(formData)) {
        // After async operations, use special scroll function
        await scrollToTopAfterAsync()
      } else {
        // Regular section change scroll
        await scrollToTopForSectionChange()
      }
      
      // Additional save after navigation to ensure state is persisted
      queueSave()
    }
  }, [currentSection, formSections.length, queueSave, autoTranslateToEnglish, hasNonEnglishContent, formData, setFormData, resumeId, resumeTitle, selectedTemplate, setIsAutoTranslating, t])

  const handlePrevious = useCallback(async () => {
    if (currentSection > 0) {
      // Force save current section data before navigation using section renderer ref
      if (formSectionRef.current) {
        formSectionRef.current.triggerSectionSave()
      }
      
      // Also trigger a direct save to ensure current state is captured
      queueSave(`section_${currentSection}`)
      
      setCurrentSection(currentSection - 1)
      await scrollToTopForSectionChange()
    }
  }, [currentSection, queueSave])

  const handleSectionChange = useCallback(async (newSection: number) => {
    if (newSection === currentSection) return
    
    // Force save current section data before navigation using section renderer ref
    if (formSectionRef.current) {
      formSectionRef.current.triggerSectionSave()
    }
    
    // Also trigger a direct save to ensure current state is captured
    queueSave(`section_${currentSection}`)
    
    setCurrentSection(newSection)
    await scrollToTopForSectionChange()
    queueSave()
  }, [currentSection, queueSave])

  // Save handler
  const handleSave = useCallback(async () => {
    if (isSaving) return

    setIsSaving(true)
    try {
      if (!resumeId) {
        // Create new resume
        const response = await fetch('/api/resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
        toast.success(t('pages.resumeBuilder.messages.resumeCreated'))
      } else {
        // Update existing resume
        const response = await fetch(`/api/resumes/${resumeId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: resumeTitle,
            template: selectedTemplate,
            formData
          })
        })

        if (!response.ok) {
          throw new Error(t('pages.resumeBuilder.errors.saveFailed'))
        }

        setLastSavedData({ ...formData })
        toast.success(t('pages.resumeBuilder.messages.resumeSaved'))
      }
    } catch (error) {
      console.error('Save error:', error)
      toast.error(error instanceof Error ? error.message : t('pages.resumeBuilder.errors.saveFailed'))
    } finally {
      setIsSaving(false)
    }
  }, [resumeId, formData, selectedTemplate, resumeTitle, isSaving, t, setLastSavedData])


  // Load existing resume on mount
  useEffect(() => {
    const loadResume = async () => {
      // Check for imported resume data first
      const importedData = sessionStorage.getItem('importedResumeData')
      const importedTitle = sessionStorage.getItem('importedResumeTitle')
      
      if (importedData && !searchParams.get('id') && !searchParams.get('resumeId')) {
        try {
          const parsedData = JSON.parse(importedData)
          const title = importedTitle || t('pages.resumeBuilder.defaults.importedTitle')
          setFormData(parsedData)
          setLastSavedData({ ...parsedData })
          setResumeTitle(title)
          
          // Clear session storage
          sessionStorage.removeItem('importedResumeData')
          sessionStorage.removeItem('importedResumeTitle')
          
          toast.success(t('pages.resumeBuilder.messages.importSuccess'))
          return
        } catch {
          // Error parsing imported data
        }
      }

      const resumeIdParam = searchParams.get('resumeId') || searchParams.get('id')
      if (!resumeIdParam) return

      setIsLoading(true)
      try {
        const response = await fetch(`/api/resumes/${resumeIdParam}`)
        if (!response.ok) {
          throw new Error(t('pages.resumeBuilder.errors.loadFailed'))
        }

        const data = await response.json()
        const resume = data.resume
        
        setResumeId(resume.id)
        setResumeTitle(resume.title || '')
        setSelectedTemplate(resume.template || 'modern')
        
        // Ensure all items have IDs
        let idCounter = 0
        const generateId = () => `${Date.now()}_${++idCounter}`
        
        const formDataWithIds = {
          ...resume.formData,
          experience: (resume.formData.experience || []).map((exp: Record<string, unknown>) => ({
            ...exp,
            id: exp.id || generateId()
          })),
          education: (resume.formData.education || []).map((edu: Record<string, unknown>) => ({
            ...edu,
            id: edu.id || generateId()
          })),
          skills: (resume.formData.skills || []).map((skill: Record<string, unknown>) => ({
            ...skill,
            id: skill.id || generateId()
          })),
          languages: (resume.formData.languages || []).map((lang: Record<string, unknown>) => ({
            ...lang,
            id: lang.id || generateId()
          })),
          projects: (resume.formData.projects || []).map((proj: Record<string, unknown>) => ({
            ...proj,
            id: proj.id || generateId()
          })),
          certifications: (resume.formData.certifications || []).map((cert: Record<string, unknown>) => ({
            ...cert,
            id: cert.id || generateId()
          }))
        }
        
        setFormData(formDataWithIds)
        setLastSavedData({ ...formDataWithIds })

        // Check for preview parameter
        const shouldPreview = searchParams.get('preview')
        if (shouldPreview === 'true') {
          setShowPreview(true)
        }
      } catch (error) {
        console.error('Load error:', error)
        toast.error(t('pages.resumeBuilder.messages.loadError'))
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadResume()
  }, [searchParams, router, t, setFormData, setLastSavedData])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 's':
            event.preventDefault()
            handleSave()
            break
          case 'p':
            event.preventDefault()
            setShowPreview(true)
            break
        }
      } else {
        switch (event.key) {
          case 'F1':
            event.preventDefault()
            setShowKeyboardHelp(true)
            break
          case 'ArrowLeft':
            if (event.altKey) {
              event.preventDefault()
              handlePrevious()
            }
            break
          case 'ArrowRight':
            if (event.altKey) {
              event.preventDefault()
              handleNext()
            }
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleSave, handlePrevious, handleNext])

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
                onClick={() => setShowKeyboardHelp(true)}
                title="Keyboard Shortcuts (F1)"
              >
                <Keyboard className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPreview(true)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {t('pages.resumeBuilder.actions.preview')}
              </Button>
              <Button 
                onClick={() => handleSave()} 
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
                {formSections.map((section, index) => (
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
                <div>
                  <h2 className="text-2xl font-bold">
                    {formSections[currentSection].title}
                  </h2>
                  <NavigationIndicator 
                    currentSection={currentSection}
                    totalSections={formSections.length}
                    className="mt-2"
                  />
                </div>
                {isAutoSaving && (
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="animate-spin h-3 w-3 mr-1 border-2 border-gray-400 border-t-transparent rounded-full" />
                    {t('pages.resumeBuilder.actions.saving')}
                  </div>
                )}
              </div>

              <FormSectionRenderer
                ref={formSectionRef}
                currentSection={currentSection}
                formData={formData}
                updatePersonalField={updatePersonalField}
                updateSummary={updateSummary}
                updateSection={updateSection}
                setFormData={setFormData}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                summaryTextareaRef={summaryTextareaRef}
                formSections={formSections}
                isAutoSaving={isAutoSaving}
                queueSave={queueSave}
                checkPermission={checkPermission}
              />

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
                {currentSection === formSections.length - 1 ? (
                  <Button onClick={() => setShowPreview(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {t('pages.resumeBuilder.actions.viewResume')}
                  </Button>
                ) : (
                  <Button onClick={handleNext} disabled={isAutoTranslating}>
                    {isAutoTranslating ? (
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
              {formSections.map((section, index) => (
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

      {/* Modals */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={formData}
        template={selectedTemplate}
      />

      <KeyboardShortcutsHelp
        isOpen={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
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