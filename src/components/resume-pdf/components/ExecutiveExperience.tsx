import { Text, View } from '@react-pdf/renderer'
import { Experience } from '@/types/resume'
import { executiveStyles } from '../styles/executiveStyles'
import { formatDate } from '../utils/dateUtils'
import { parseHtmlToPdf } from '../utils/htmlToPdfParser'

interface ExecutiveExperienceProps {
  experience: Experience[]
}

export const ExecutiveExperience = ({ experience }: ExecutiveExperienceProps) => {
  if (!experience || experience.length === 0) return null

  return (
    <View style={executiveStyles.section}>
      {experience.map((exp, index) => {
        if (index === 0) {
          // For the first item, keep section title + item header together, but allow description to flow
          return (
            <View key={exp.id} style={executiveStyles.experienceItem}>
              <View wrap={false}>
                <Text style={executiveStyles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                <View style={executiveStyles.experienceHeader}>
                  <Text style={executiveStyles.jobTitle}>{exp.jobTitle}</Text>
                  <Text style={executiveStyles.dateRange}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </Text>
                </View>
                <View style={executiveStyles.companyInfo}>
                  <Text style={executiveStyles.company}>{exp.company}</Text>
                  {exp.location && <Text style={executiveStyles.location}>{exp.location}</Text>}
                </View>
              </View>
              {exp.description && (
                <View style={{ marginTop: 2 }}>
                  {parseHtmlToPdf(exp.description, { 
                    text: { fontSize: 10, color: '#374151', lineHeight: 1.4 }
                  }).elements}
                </View>
              )}
            </View>
          )
        } else {
          // For subsequent items, keep them together
          return (
            <View key={exp.id} style={executiveStyles.experienceItem} wrap={false}>
              <View style={executiveStyles.experienceHeader}>
                <Text style={executiveStyles.jobTitle}>{exp.jobTitle}</Text>
                <Text style={executiveStyles.dateRange}>
                  {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                </Text>
              </View>
              <View style={executiveStyles.companyInfo}>
                <Text style={executiveStyles.company}>{exp.company}</Text>
                {exp.location && <Text style={executiveStyles.location}>{exp.location}</Text>}
              </View>
              {exp.description && (
                <View style={{ marginTop: 2 }}>
                  {parseHtmlToPdf(exp.description, { 
                    text: { fontSize: 10, color: '#374151', lineHeight: 1.4 }
                  }).elements}
                </View>
              )}
            </View>
          )
        }
      })}
    </View>
  )
}