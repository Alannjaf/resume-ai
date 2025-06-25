import { Text, View } from '@react-pdf/renderer'
import { Skill } from '@/types/resume'
import { executiveStyles } from '../styles/executiveStyles'

interface ExecutiveSkillsProps {
  skills: Skill[]
}

export const ExecutiveSkills = ({ skills }: ExecutiveSkillsProps) => {
  if (!skills || skills.length === 0) return null

  return (
    <View style={executiveStyles.section} wrap={false}>
      <Text style={executiveStyles.sectionTitle}>CORE COMPETENCIES</Text>
      <View style={executiveStyles.skillsGrid}>
        {skills.map((skill, index) => (
          <Text key={skill.id} style={executiveStyles.skillItem}>
            {skill.name}
            {index < skills.length - 1 && ' • '}
          </Text>
        ))}
      </View>
    </View>
  )
}