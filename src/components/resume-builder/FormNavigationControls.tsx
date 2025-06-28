import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface FormNavigationControlsProps {
  currentSection: number
  totalSections: number
  onPrevious: () => void
  onNext: () => void
}

export function FormNavigationControls({
  currentSection,
  totalSections,
  onPrevious,
  onNext
}: FormNavigationControlsProps) {
  const { t } = useLanguage()

  return (
    <div className="flex justify-between items-center pt-6 border-t">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentSection === 0}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('pages.resumeBuilder.buttons.previous')}
      </Button>
      
      <span className="text-sm text-gray-500">
        {currentSection + 1} {t('pages.resumeBuilder.navigation.of')} {totalSections}
      </span>
      
      <Button
        onClick={onNext}
        disabled={currentSection === totalSections - 1}
        className="flex items-center gap-2"
      >
        {t('pages.resumeBuilder.buttons.next')}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}