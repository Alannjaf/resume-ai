import { Button } from '@/components/ui/button'
import { NavigationIndicator } from '@/components/ui/navigation-indicator'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/utils'

interface SidebarProps {
  currentSection: number
  onSectionChange: (index: number) => void
  formSections: Array<{
    id: string
    title: string
    icon: string
  }>
}

export function ResumeBuilderSidebar({ 
  currentSection, 
  onSectionChange, 
  formSections 
}: SidebarProps) {
  const { t } = useLanguage()

  return (
    <div className="w-64 bg-white shadow-lg p-6 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-6 text-gray-800">
        {t('pages.resumeBuilder.navigation.sections')}
      </h2>
      
      <NavigationIndicator 
        currentSection={currentSection} 
        totalSections={formSections.length} 
      />
      
      <div className="space-y-2 mt-6">
        {formSections.map((section, index) => (
          <Button
            key={section.id}
            variant={currentSection === index ? "default" : "ghost"}
            className={cn(
              "w-full justify-start text-left h-auto p-3",
              currentSection === index && "bg-blue-50 text-blue-600 border-blue-200"
            )}
            onClick={() => onSectionChange(index)}
          >
            <span className="text-lg mr-3">{section.icon}</span>
            <span className="text-sm">{section.title}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}