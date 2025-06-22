'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { AppHeader } from '@/components/shared/AppHeader'
import { ArrowLeft, ArrowRight, Save, Eye } from 'lucide-react'
import { WorkExperienceForm } from '@/components/resume-builder/WorkExperienceForm'
import { EducationForm } from '@/components/resume-builder/EducationForm'
import { SkillsForm } from '@/components/resume-builder/SkillsForm'
import { LanguagesForm } from '@/components/resume-builder/LanguagesForm'
import { ProjectsForm } from '@/components/resume-builder/ProjectsForm'
import { CertificationsForm } from '@/components/resume-builder/CertificationsForm'
import { PreviewModal } from '@/components/resume-builder/PreviewModal'
import { TemplateGallery } from '@/components/resume-builder/TemplateGallery'
import { AIProfessionalSummary } from '@/components/ai/AIProfessionalSummary'
import ImageUploader from '@/components/resume-builder/ImageUploader'
import { ResumeData } from '@/types/resume'
import toast from 'react-hot-toast'

// Form sections
const FORM_SECTIONS = [
  { id: 'personal', title: 'Personal Information', icon: '👤' },
  { id: 'summary', title: 'Professional Summary', icon: '📝' },
  { id: 'experience', title: 'Work Experience', icon: '💼' },
  { id: 'education', title: 'Education', icon: '🎓' },
  { id: 'skills', title: 'Skills', icon: '⚡' },
  { id: 'languages', title: 'Languages', icon: '🌐' },
  { id: 'projects', title: 'Projects', icon: '💻' },
  { id: 'certifications', title: 'Certifications', icon: '🏆' },
  { id: 'template', title: 'Choose Template', icon: '🎨' },
]

function ResumeBuilderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentSection, setCurrentSection] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [resumeTitle, setResumeTitle] = useState('My Resume')
  const [lastSavedData, setLastSavedData] = useState<ResumeData | null>(null)
  const [saveQueue, setSaveQueue] = useState<NodeJS.Timeout | null>(null)
  const [userPermissions, setUserPermissions] = useState<{
    canUploadPhoto: boolean
    availableTemplates: string[]
  }>({
    canUploadPhoto: false,
    availableTemplates: ['modern']
  })
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
          throw new Error('Failed to create resume')
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
        throw new Error('Failed to save progress')
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
    if (!lastSavedData) return

    const changes: any = {}
    let hasChanges = false

    // Check for basic changes
    if (resumeTitle !== lastSavedData.personal?.fullName) {
      changes.title = resumeTitle
      hasChanges = true
    }

    if (formData.personal !== lastSavedData.personal) {
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

  const handleNext = async () => {
    if (currentSection < FORM_SECTIONS.length - 1) {
      // Move to next section immediately (optimistic update)
      setCurrentSection(currentSection + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })

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

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
        throw new Error(error.error || 'Failed to save resume')
      }

      const data = await response.json()
      
      if (!resumeId) {
        setResumeId(data.resume.id)
      }

      // Show success message only if requested
      if (showToast) {
        toast.success('Resume saved successfully!')
      }
      
      return true // Return success status
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save resume')
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
    window.scrollTo({ top: 0, behavior: 'smooth' })

    // Save old section data in background
    const sectionKey = getSectionKey(oldSection)
    if (sectionKey) {
      queueSave(sectionKey)
    }
  }

  // Load user permissions
  useEffect(() => {
    const loadUserPermissions = async () => {
      try {
        const response = await fetch('/api/user/permissions')
        if (response.ok) {
          const permissions = await response.json()
          setUserPermissions({
            canUploadPhoto: permissions.canUploadPhoto || false,
            availableTemplates: permissions.availableTemplates || ['modern']
          })
        }
      } catch (error) {
        console.error('Failed to load user permissions:', error)
      }
    }
    
    loadUserPermissions()
  }, [])

  // Load resume data if editing existing resume or importing
  useEffect(() => {
    const loadResume = async () => {
      // Check for imported resume data first
      const importedData = sessionStorage.getItem('importedResumeData')
      const importedTitle = sessionStorage.getItem('importedResumeTitle')
      
      if (importedData && !searchParams.get('id')) {
        try {
          const parsedData = JSON.parse(importedData) as ResumeData
          setFormData(parsedData)
          setLastSavedData(parsedData) // Set initial baseline for change detection
          setResumeTitle(importedTitle || 'Imported Resume')
          
          // Clear session storage
          sessionStorage.removeItem('importedResumeData')
          sessionStorage.removeItem('importedResumeTitle')
          
          toast.success('Resume data imported. You can now edit and save.')
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
          throw new Error('Failed to load resume')
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
        setLastSavedData(formDataWithIds) // Set initial baseline for change detection
        
        // Check if preview should be opened automatically
        const shouldPreview = searchParams.get('preview')
        if (shouldPreview === 'true') {
          setShowPreview(true)
        }
      } catch (error) {
        toast.error('Failed to load resume')
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
          <p>Loading resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title="Resume Builder"
        showBackButton={true}
        backButtonText="Back to Dashboard"
        backButtonHref="/dashboard"
      />
      
      {/* Resume Controls Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Resume Title */}
            <div className="flex flex-col">
              <label htmlFor="resume-title" className="text-sm font-medium text-gray-700 mb-1">
                Resume Title
              </label>
              <input
                id="resume-title"
                type="text"
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter resume title"
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
                Preview
              </Button>
              <Button 
                onClick={() => handleSave(true)} 
                size="sm"
                disabled={isSaving || isAutoSaving}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
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
              <h2 className="text-lg font-semibold mb-4">Progress</h2>
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
                    Saving...
                  </div>
                )}
              </div>

              {/* Personal Information Section */}
              {currentSection === 0 && (
                <div className="space-y-6">
                  {/* Profile Image Upload - Only show if user has permission */}
                  {userPermissions.canUploadPhoto ? (
                    <div className="flex justify-center">
                      <ImageUploader
                        currentImage={formData.personal.profileImage}
                        onImageUpload={(imageDataUrl) =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              profileImage: imageDataUrl,
                            },
                          })
                        }
                        onImageRemove={() =>
                          setFormData({
                            ...formData,
                            personal: {
                              ...formData.personal,
                              profileImage: undefined,
                            },
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="text-center p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="text-gray-400 mb-2">📷</div>
                        <p className="text-sm text-gray-600">Profile photo upload is available for BASIC and PRO plans</p>
                        <p className="text-xs text-gray-500 mt-1">Upgrade your plan to add a professional profile photo</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name *
                      </label>
                      <Input
                        placeholder="John Doe"
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
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Professional Title
                      </label>
                      <Input
                        placeholder="Software Engineer"
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
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Email *
                      </label>
                      <Input
                        type="email"
                        placeholder="john@example.com"
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
                        Phone
                      </label>
                      <Input
                        placeholder="+1 (555) 123-4567"
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
                        Location
                      </label>
                      <Input
                        placeholder="New York, NY"
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
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        LinkedIn
                      </label>
                      <Input
                        placeholder="linkedin.com/in/johndoe"
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
                        Website
                      </label>
                      <Input
                        placeholder="johndoe.com"
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
                      ✨ AI-Powered
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
                      <span className="px-4 bg-white text-gray-500">OR write manually</span>
                    </div>
                  </div>

                  {/* Manual Input Section */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Professional Summary
                    </label>
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={6}
                      placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
                      value={formData.summary}
                      onChange={(e) =>
                        setFormData({ ...formData, summary: e.target.value })
                      }
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> Keep your summary concise (3-4 sentences) and focus on your unique value proposition.
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
                    allowedTemplates={userPermissions.availableTemplates}
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
                  Previous
                </Button>
                {currentSection === FORM_SECTIONS.length - 1 ? (
                  <Button onClick={() => setShowPreview(true)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Resume
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Progress Section for Mobile - Shown only on mobile */}
        <div className="lg:hidden mt-8">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Progress</h2>
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
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p>Loading resume builder...</p>
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