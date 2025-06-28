import { RefObject } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { AIProfessionalSummary } from '@/components/ai/AIProfessionalSummary'
import { ResumeData } from '@/types/resume'

interface ProfessionalSummarySectionProps {
  formData: ResumeData
  updateSummary: (summary: string) => void
  summaryTextareaRef: RefObject<HTMLTextAreaElement | null>
}

export function ProfessionalSummarySection({ 
  formData, 
  updateSummary, 
  summaryTextareaRef 
}: ProfessionalSummarySectionProps) {
  const { t } = useLanguage()

  return (
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
          onAccept={(summary) => {
            updateSummary(summary)
            summaryTextareaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            summaryTextareaRef.current?.focus()
          }}
          experience={formData.experience || []}
          skills={formData.skills || []}
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
          ref={summaryTextareaRef}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={6}
          placeholder={t('forms.professionalSummary.placeholder')}
          value={formData.summary}
          onChange={(e) => updateSummary(e.target.value)}
        />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>{t('common.tip')}:</strong> {t('forms.professionalSummary.tip')}
        </p>
      </div>
    </div>
  )
}