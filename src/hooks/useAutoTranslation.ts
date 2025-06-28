import { useState, useCallback } from 'react'
import { ResumeData } from '@/types/resume'
import { isNonEnglishContent } from '@/lib/languageDetection'
import { useLanguage } from '@/contexts/LanguageContext'
import toast from 'react-hot-toast'

export function useAutoTranslation() {
  const { t } = useLanguage()
  const [isAutoTranslating, setIsAutoTranslating] = useState(false)

  // Quick check if form data contains any non-English content
  const hasNonEnglishContent = useCallback((formData: ResumeData): boolean => {
    // Personal information
    if (formData.personal.fullName && isNonEnglishContent(formData.personal.fullName)) return true
    if (formData.personal.title && isNonEnglishContent(formData.personal.title)) return true
    if (formData.personal.location && isNonEnglishContent(formData.personal.location)) return true
    if (formData.personal.nationality && isNonEnglishContent(formData.personal.nationality)) return true
    if (formData.personal.country && isNonEnglishContent(formData.personal.country)) return true

    // Professional summary
    if (formData.summary && isNonEnglishContent(formData.summary)) return true

    // Work experience
    for (const exp of formData.experience) {
      if (exp.jobTitle && isNonEnglishContent(exp.jobTitle)) return true
      if (exp.company && isNonEnglishContent(exp.company)) return true
      if (exp.location && isNonEnglishContent(exp.location)) return true
      if (exp.description && isNonEnglishContent(exp.description)) return true
    }

    // Education
    for (const edu of formData.education) {
      if (edu.degree && isNonEnglishContent(edu.degree)) return true
      if (edu.field && isNonEnglishContent(edu.field)) return true
      if (edu.school && isNonEnglishContent(edu.school)) return true
      if (edu.location && isNonEnglishContent(edu.location)) return true
      if (edu.achievements && isNonEnglishContent(edu.achievements)) return true
    }

    // Skills
    for (const skill of formData.skills) {
      if (skill.name && isNonEnglishContent(skill.name)) return true
    }

    // Languages
    for (const language of formData.languages) {
      if (language.name && isNonEnglishContent(language.name)) return true
    }

    // Projects
    if (formData.projects) {
      for (const project of formData.projects) {
        if (project.name && isNonEnglishContent(project.name)) return true
        if (project.description && isNonEnglishContent(project.description)) return true
        if (project.technologies && isNonEnglishContent(project.technologies)) return true
      }
    }

    // Certifications
    if (formData.certifications) {
      for (const cert of formData.certifications) {
        if (cert.name && isNonEnglishContent(cert.name)) return true
        if (cert.issuer && isNonEnglishContent(cert.issuer)) return true
      }
    }

    return false
  }, [])

  const autoTranslateToEnglish = useCallback(async (formData: ResumeData): Promise<ResumeData> => {
    const translatedData = { ...formData }
    let hasTranslations = false

    try {
      // Collect all content that needs translation
      const translationTasks: Array<{
        content: string
        contentType: string
        contextInfo?: Record<string, string>
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

      // Optional personal fields
      if (formData.personal.nationality && isNonEnglishContent(formData.personal.nationality)) {
        translationTasks.push({
          content: formData.personal.nationality,
          contentType: 'personal',
          updatePath: ['personal', 'nationality']
        })
      }

      if (formData.personal.country && isNonEnglishContent(formData.personal.country)) {
        translationTasks.push({
          content: formData.personal.country,
          contentType: 'personal',
          updatePath: ['personal', 'country']
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

      // If no translation tasks, return original data
      if (translationTasks.length === 0) {
        return translatedData
      }

      // Process translations in batches
      const batchSize = 5
      for (let i = 0; i < translationTasks.length; i += batchSize) {
        const batch = translationTasks.slice(i, i + batchSize)
        
        await Promise.all(batch.map(async (task) => {
          try {
            const response = await fetch('/api/ai/translate-enhance', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                content: task.content,
                contentType: task.contentType,
                contextInfo: task.contextInfo
              })
            })

            if (response.ok) {
              const data = await response.json()
              
              // Update the translated data
              if (task.index !== undefined) {
                const section = translatedData[task.updatePath[0] as keyof ResumeData] as unknown as Array<Record<string, unknown>>
                if (section[task.index]) {
                  section[task.index][task.updatePath[1]] = data.enhancedContent
                  hasTranslations = true
                }
              } else if (task.updatePath.length === 2) {
                const section = translatedData[task.updatePath[0] as keyof ResumeData] as unknown as Record<string, unknown>
                section[task.updatePath[1]] = data.enhancedContent
                hasTranslations = true
              } else if (task.updatePath.length === 1) {
                (translatedData as Record<string, unknown>)[task.updatePath[0]] = data.enhancedContent
                hasTranslations = true
              }
            }
          } catch (error) {
            console.error('Translation error for:', task.content, error)
          }
        }))

        // Small delay between batches to avoid overwhelming the API
        if (i + batchSize < translationTasks.length) {
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }

      if (hasTranslations) {
        toast.success(t('pages.resumeBuilder.autoTranslate.success'))
      }

      return translatedData
    } catch (error) {
      console.error('Auto-translation error:', error)
      toast.error(t('pages.resumeBuilder.autoTranslate.error'))
      return formData
    }
  }, [t])

  return {
    isAutoTranslating,
    setIsAutoTranslating,
    autoTranslateToEnglish,
    hasNonEnglishContent
  }
}