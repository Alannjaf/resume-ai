'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AppHeader } from '@/components/shared/AppHeader'
import { CheckCircle, Edit, ArrowLeft, Crown } from 'lucide-react'
import { ResumeUploader } from '@/components/resume-builder/ResumeUploader'
import { ResumeData } from '@/types/resume'
import toast from 'react-hot-toast'

export default function ImportResumePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<'upload' | 'review' | 'edit'>('upload')
  const [extractedData, setExtractedData] = useState<ResumeData | null>(null)
  const [resumeTitle, setResumeTitle] = useState('Imported Resume')
  const [isSaving, setIsSaving] = useState(false)
  const [canImport, setCanImport] = useState<boolean | null>(null)
  const [userPlan, setUserPlan] = useState<string>('')

  useEffect(() => {
    // Check if user can import
    const checkImportAccess = async () => {
      try {
        const response = await fetch('/api/user/subscription')
        const data = await response.json()
        setUserPlan(data.currentPlan)
        setCanImport(data.currentPlan === 'PRO')
      } catch (error) {
        setCanImport(false)
      }
    }
    
    checkImportAccess()
  }, [])

  const handleUploadComplete = (data: ResumeData) => {
    setExtractedData(data)
    setCurrentStep('review')
    
    // Set title based on extracted name
    if (data.personal?.fullName) {
      setResumeTitle(`${data.personal.fullName}'s Resume`)
    }
  }

  const handleSave = async () => {
    if (!extractedData) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: resumeTitle,
          template: 'modern',
          formData: extractedData
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save resume')
      }

      const result = await response.json()
      toast.success('Resume imported successfully!')
      
      // Redirect to edit the new resume
      router.push(`/resume-builder?id=${result.resume.id}`)
    } catch (error) {
      toast.error('Failed to save resume. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const renderUploadStep = () => {
    if (canImport === null) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )
    }

    if (!canImport) {
      return (
        <Card className="p-8 text-center">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">PRO Feature</h2>
          <p className="text-gray-600 mb-6">
            Resume import is exclusively available for PRO users. 
            Upgrade your plan to import existing resumes and convert them to our format.
          </p>
          <div className="space-x-4">
            <Button onClick={() => router.push('/billing')}>
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to PRO
            </Button>
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      )
    }

    return (
      <ResumeUploader
        onUploadComplete={handleUploadComplete}
        onCancel={() => router.push('/dashboard')}
      />
    )
  }

  const renderReviewStep = () => {
    if (!extractedData) return null

    return (
      <Card className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Review Extracted Information</h2>
          <p className="text-gray-600">
            We've extracted the following information from your resume. Review and confirm before proceeding.
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Resume Title</label>
          <input
            type="text"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-6 mb-8">
          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Personal Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <span className="text-sm text-gray-600">Name:</span>
                <p className="font-medium">{extractedData.personal.fullName || 'Not found'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <p className="font-medium">{extractedData.personal.email || 'Not found'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Phone:</span>
                <p className="font-medium">{extractedData.personal.phone || 'Not found'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Location:</span>
                <p className="font-medium">{extractedData.personal.location || 'Not found'}</p>
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          {extractedData.summary && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Professional Summary
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">{extractedData.summary}</p>
              </div>
            </div>
          )}

          {/* Work Experience */}
          {extractedData.experience.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Work Experience ({extractedData.experience.length} positions)
              </h3>
              <div className="space-y-3">
                {extractedData.experience.slice(0, 2).map((exp, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{exp.jobTitle}</p>
                    <p className="text-sm text-gray-600">{exp.company} • {exp.location}</p>
                    <p className="text-sm text-gray-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    {exp.description && (
                      <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{exp.description}</p>
                    )}
                  </div>
                ))}
                {extractedData.experience.length > 2 && (
                  <p className="text-sm text-gray-500 italic">
                    ... and {extractedData.experience.length - 2} more positions
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Education */}
          {extractedData.education.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Education ({extractedData.education.length} entries)
              </h3>
              <div className="space-y-3">
                {extractedData.education.map((edu, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium">{edu.degree} in {edu.field}</p>
                    <p className="text-sm text-gray-600">{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {extractedData.skills.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Skills ({extractedData.skills.length} skills)
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {extractedData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white rounded-full text-sm border"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Languages */}
          {extractedData.languages.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Languages ({extractedData.languages.length} languages)
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {extractedData.languages.map((language, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium">{language.name}</span>
                      <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                        {language.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep('upload')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="space-x-3">
            <Button
              variant="outline"
              onClick={() => {
                if (extractedData) {
                  // Save to session storage and go to resume builder
                  sessionStorage.setItem('importedResumeData', JSON.stringify(extractedData))
                  sessionStorage.setItem('importedResumeTitle', resumeTitle)
                  router.push('/resume-builder')
                }
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Before Saving
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                'Save Resume'
              )}
            </Button>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader 
        title="Import Resume"
        showBackButton={true}
        backButtonText="Back to Dashboard"
        backButtonHref="/dashboard"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'upload' && renderUploadStep()}
        {currentStep === 'review' && renderReviewStep()}
      </main>
    </div>
  )
}