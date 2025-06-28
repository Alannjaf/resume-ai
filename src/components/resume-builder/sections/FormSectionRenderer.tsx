import { RefObject } from 'react'
import { PersonalInfoSection } from './PersonalInfoSection'
import { ProfessionalSummarySection } from './ProfessionalSummarySection'
import { WorkExperienceForm } from '@/components/resume-builder/WorkExperienceForm'
import { EducationForm } from '@/components/resume-builder/EducationForm'
import { SkillsForm } from '@/components/resume-builder/SkillsForm'
import { LanguagesForm } from '@/components/resume-builder/LanguagesForm'
import { ProjectsForm } from '@/components/resume-builder/ProjectsForm'
import { CertificationsForm } from '@/components/resume-builder/CertificationsForm'
import { TemplateGallery } from '@/components/resume-builder/TemplateGallery'
import { ResumeData } from '@/types/resume'
import { SubscriptionPermissions } from '@/types/subscription'

interface FormSectionRendererProps {
  currentSection: number
  formData: ResumeData
  updatePersonalField: (field: string, value: string) => void
  updateSummary: (summary: string) => void
  updateSection: (section: keyof ResumeData, data: unknown) => void
  setFormData: (data: ResumeData) => void
  selectedTemplate: string
  setSelectedTemplate: (template: string) => void
  summaryTextareaRef: RefObject<HTMLTextAreaElement | null>
  formSections: Array<{ id: string; title: string; icon: string }>
  isAutoSaving: boolean
  queueSave: (sectionType?: string) => void
  checkPermission?: (permission: keyof SubscriptionPermissions) => boolean
}

export function FormSectionRenderer({
  currentSection,
  formData,
  updatePersonalField,
  updateSummary,
  updateSection,
  setFormData,
  selectedTemplate,
  setSelectedTemplate,
  summaryTextareaRef,
  queueSave,
  checkPermission
}: FormSectionRendererProps) {
  const renderSectionContent = () => {
    switch (currentSection) {
      case 0: // Personal Information
        return (
          <PersonalInfoSection
            formData={formData}
            updatePersonalField={updatePersonalField}
            setFormData={setFormData}
            checkPermission={checkPermission}
          />
        )

      case 1: // Professional Summary
        return (
          <ProfessionalSummarySection
            formData={formData}
            updateSummary={updateSummary}
            summaryTextareaRef={summaryTextareaRef}
          />
        )

      case 2: // Work Experience
        return (
          <WorkExperienceForm
            experiences={formData.experience || []}
            onChange={(experiences) => {
              updateSection('experience', experiences)
              queueSave('experience')
            }}
          />
        )

      case 3: // Education
        return (
          <EducationForm
            education={formData.education || []}
            onChange={(education) => {
              updateSection('education', education)
              queueSave('education')
            }}
          />
        )

      case 4: // Skills
        return (
          <SkillsForm
            skills={formData.skills || []}
            onChange={(skills) => {
              updateSection('skills', skills)
              queueSave('skills')
            }}
          />
        )

      case 5: // Languages
        return (
          <LanguagesForm
            languages={formData.languages || []}
            onChange={(languages) => {
              updateSection('languages', languages)
              queueSave('languages')
            }}
          />
        )

      case 6: // Projects
        return (
          <ProjectsForm
            projects={formData.projects || []}
            onChange={(projects) => {
              updateSection('projects', projects)
              queueSave('projects')
            }}
          />
        )

      case 7: // Certifications
        return (
          <CertificationsForm
            certifications={formData.certifications || []}
            onChange={(certifications) => {
              updateSection('certifications', certifications)
              queueSave('certifications')
            }}
          />
        )

      case 8: // Template Selection
        return (
          <TemplateGallery
            selectedTemplate={selectedTemplate}
            onTemplateSelect={setSelectedTemplate}
          />
        )

      default:
        return <div>Section not found</div>
    }
  }

  return (
    <div>
      {renderSectionContent()}
    </div>
  )
}