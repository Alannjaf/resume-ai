import { Text, View } from '@react-pdf/renderer'
import { Language } from '@/types/resume'
import { executiveStyles } from '../styles/executiveStyles'

interface ExecutiveLanguagesProps {
  languages: Language[]
}

export const ExecutiveLanguages = ({ languages }: ExecutiveLanguagesProps) => {
  if (!languages || languages.length === 0) return null

  return (
    <View style={executiveStyles.section} wrap={false}>
      <Text style={executiveStyles.sectionTitle}>LANGUAGES</Text>
      <View style={executiveStyles.languagesRow}>
        {languages.map((language) => (
          <View key={language.id} style={executiveStyles.languageChip}>
            <Text style={executiveStyles.languageName}>{language.name}</Text>
            <Text style={executiveStyles.languageLevel}>({language.proficiency || 'Basic'})</Text>
          </View>
        ))}
      </View>
    </View>
  )
}