import { Text, View } from '@react-pdf/renderer'
import { Education } from '@/types/resume'
import { executiveStyles } from '../styles/executiveStyles'
import { formatDate } from '../utils/dateUtils'
import { parseHtmlToPdf } from '../utils/htmlToPdfParser'

interface ExecutiveEducationProps {
  education: Education[]
}

export const ExecutiveEducation = ({ education }: ExecutiveEducationProps) => {
  if (!education || education.length === 0) return null

  return (
    <View style={executiveStyles.section}>
      {education.map((edu, index) => (
        <View key={edu.id} style={executiveStyles.educationItem} wrap={false}>
          {index === 0 && (
            <Text style={executiveStyles.sectionTitle}>EDUCATION</Text>
          )}
          <View style={executiveStyles.educationHeader} wrap={false}>
            <Text style={executiveStyles.degree}>{edu.degree}</Text>
            <Text style={executiveStyles.dateRange}>
              {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
            </Text>
          </View>
          <Text style={executiveStyles.school}>{edu.school}</Text>
          {edu.field && <Text style={executiveStyles.field}>{edu.field}</Text>}
          {edu.location && <Text style={executiveStyles.location}>{edu.location}</Text>}
          {edu.gpa && <Text style={executiveStyles.gpa}>GPA: {edu.gpa}</Text>}
          {edu.achievements && (
            <View style={{ marginTop: 2 }}>
              {parseHtmlToPdf(edu.achievements, { 
                text: { fontSize: 10, color: '#374151', lineHeight: 1.4 }
              }).elements}
            </View>
          )}
        </View>
      ))}
    </View>
  )
}