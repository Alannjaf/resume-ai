import { Text, View } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { executiveStyles } from '../styles/executiveStyles'
import { formatDate } from '../utils/dateUtils'

interface ExecutiveContentProps {
  data: ResumeData
}

export const ExecutiveContent = ({ data }: ExecutiveContentProps) => {
  return (
    <View style={executiveStyles.contentContainer}>
      {/* Work Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <View style={executiveStyles.section}>
          {data.experience.map((exp, index) => (
            <View key={exp.id} wrap={false}>
              {index === 0 && (
                <Text style={executiveStyles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
              )}
              <View style={executiveStyles.experienceItem}>
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
                  <Text style={executiveStyles.description}>{exp.description}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <View style={executiveStyles.section}>
          {data.education.map((edu, index) => (
            <View key={edu.id} wrap={false}>
              {index === 0 && (
                <Text style={executiveStyles.sectionTitle}>EDUCATION</Text>
              )}
              <View style={executiveStyles.educationItem}>
                <View style={executiveStyles.educationHeader}>
                  <Text style={executiveStyles.degree}>{edu.degree}</Text>
                  <Text style={executiveStyles.dateRange}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
                <Text style={executiveStyles.school}>{edu.school}</Text>
                {edu.field && <Text style={executiveStyles.field}>{edu.field}</Text>}
                {edu.location && <Text style={executiveStyles.location}>{edu.location}</Text>}
                {edu.gpa && <Text style={executiveStyles.gpa}>GPA: {edu.gpa}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <View style={executiveStyles.section} wrap={false}>
          <Text style={executiveStyles.sectionTitle}>CORE COMPETENCIES</Text>
          <View style={executiveStyles.skillsGrid}>
            {data.skills.map((skill, index) => (
              <Text key={skill.id} style={executiveStyles.skillItem}>
                {skill.name}
                {index < data.skills!.length - 1 && ' • '}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Languages Section */}
      {data.languages && data.languages.length > 0 && (
        <View wrap={false} style={executiveStyles.section}>
          <Text style={executiveStyles.sectionTitle}>LANGUAGES</Text>
          {data.languages.map((language) => (
            <View key={language.id} style={executiveStyles.languageItem}>
              <View style={executiveStyles.languageHeader}>
                <Text style={executiveStyles.languageName}>{language.name}</Text>
                <Text style={executiveStyles.languageLevel}>{language.proficiency}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}