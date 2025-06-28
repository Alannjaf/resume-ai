import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Eye, Keyboard } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface HeaderProps {
  onBack: () => void
  onSave: () => void
  onPreview: () => void
  onShowKeyboardHelp: () => void
  isSaving: boolean
  isAutoSaving: boolean
  resumeTitle: string
}

export function ResumeBuilderHeader({
  onBack,
  onSave,
  onPreview,
  onShowKeyboardHelp,
  isSaving,
  isAutoSaving,
  resumeTitle
}: HeaderProps) {
  const { t } = useLanguage()

  return (
    <div className="bg-white shadow-sm border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('pages.resumeBuilder.buttons.back')}
          </Button>
          
          <h1 className="text-xl font-semibold text-gray-800">
            {resumeTitle || t('pages.resumeBuilder.title')}
          </h1>
          
          {isAutoSaving && (
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {t('pages.resumeBuilder.status.autoSaving')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onShowKeyboardHelp}
            className="flex items-center gap-2"
          >
            <Keyboard className="h-4 w-4" />
            {t('pages.resumeBuilder.buttons.shortcuts')}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onPreview}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {t('pages.resumeBuilder.buttons.preview')}
          </Button>
          
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving 
              ? t('pages.resumeBuilder.status.saving') 
              : t('pages.resumeBuilder.buttons.save')
            }
          </Button>
        </div>
      </div>
    </div>
  )
}