import { useCallback } from 'react'

interface UseResumeNavigationProps {
  currentSection: number
  setCurrentSection: (section: number) => void
  totalSections: number
  onSectionChange?: () => void
}

export function useResumeNavigation({
  currentSection,
  setCurrentSection,
  totalSections,
  onSectionChange
}: UseResumeNavigationProps) {
  
  const handlePrevious = useCallback(() => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
      onSectionChange?.()
    }
  }, [currentSection, setCurrentSection, onSectionChange])

  const handleNext = useCallback(() => {
    if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1)
      onSectionChange?.()
    }
  }, [currentSection, setCurrentSection, totalSections, onSectionChange])

  const goToSection = useCallback((sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < totalSections && sectionIndex !== currentSection) {
      setCurrentSection(sectionIndex)
      onSectionChange?.()
    }
  }, [currentSection, setCurrentSection, totalSections, onSectionChange])

  return {
    handlePrevious,
    handleNext,
    goToSection,
    canGoPrevious: currentSection > 0,
    canGoNext: currentSection < totalSections - 1
  }
}