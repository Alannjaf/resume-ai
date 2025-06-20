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
  const [resumeTitle, setResumeTitle] = useState('My Resume')
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

  const handleNext = () => {
    if (currentSection < FORM_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSave = async () => {
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

      // Show success message
      toast.success('Resume saved successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save resume')
    } finally {
      setIsSaving(false)
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
                onClick={handleSave} 
                size="sm"
                disabled={isSaving}
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
                    onClick={() => setCurrentSection(index)}
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
              <h2 className="text-2xl font-bold mb-6">
                {FORM_SECTIONS[currentSection].title}
              </h2>

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
                  
                  {/* AI Professional Summary Generator */}
                  <AIProfessionalSummary
                    currentSummary={formData.summary}
                    onAccept={(summary) => setFormData({ ...formData, summary })}
                    personalInfo={formData.personal}
                    experience={formData.experience}
                    skills={formData.skills}
                  />
                  
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
                  onClick={() => setCurrentSection(index)}
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