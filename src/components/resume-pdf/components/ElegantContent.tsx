import { Text, View } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { elegantStyles } from '../styles/elegantStyles'
import { formatDate } from '../utils/dateUtils'

interface ElegantContentProps {
  data: ResumeData
}

export const ElegantContent = ({ data }: ElegantContentProps) => {
  return (
    <View>
      {/* Professional Summary Section */}
      {data.summary && (
        <View style={elegantStyles.summarySection} wrap={false}>
          <Text style={elegantStyles.summaryText}>{data.summary}</Text>
        </View>
      )}

      {/* Work Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <View style={elegantStyles.section}>
          {data.experience.map((exp, index) => (
            <View key={exp.id} wrap={false}>
              {index === 0 && (
                <Text style={[elegantStyles.sectionTitle, elegantStyles.sectionTitleWithLine]}>
                  Professional Experience
                </Text>
              )}
              <View style={elegantStyles.experienceItem}>
                <View style={elegantStyles.experienceHeader}>
                  <Text style={elegantStyles.jobTitle}>{exp.jobTitle}</Text>
                  <Text style={elegantStyles.dateRange}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </Text>
                </View>
                <View style={elegantStyles.companyInfo}>
                  <Text style={elegantStyles.company}>{exp.company}</Text>
                  {exp.location && <Text style={elegantStyles.location}>{exp.location}</Text>}
                </View>
                {exp.description && (
                  <Text style={elegantStyles.description}>{exp.description}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <View style={elegantStyles.section}>
          {data.education.map((edu, index) => (
            <View key={edu.id} wrap={false}>
              {index === 0 && (
                <Text style={[elegantStyles.sectionTitle, elegantStyles.sectionTitleWithLine]}>
                  Education
                </Text>
              )}
              <View style={elegantStyles.educationItem}>
                <View style={elegantStyles.educationHeader}>
                  <Text style={elegantStyles.degree}>{edu.degree}</Text>
                  <Text style={elegantStyles.dateRange}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
                <Text style={elegantStyles.school}>{edu.school}</Text>
                {edu.field && <Text style={elegantStyles.field}>{edu.field}</Text>}
                {edu.location && <Text style={elegantStyles.location}>{edu.location}</Text>}
                {edu.gpa && <Text style={elegantStyles.gpa}>GPA: {edu.gpa}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <View style={elegantStyles.section} wrap={false}>
          <Text style={[elegantStyles.sectionTitle, elegantStyles.sectionTitleWithLine]}>
            Core Skills
          </Text>
          <View style={elegantStyles.skillsContainer}>
            {data.skills.map((skill) => (
              <View key={skill.id} style={elegantStyles.skillChip}>
                <Text style={elegantStyles.skillText}>{skill.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Languages Section */}
      {data.languages && data.languages.length > 0 && (
        <View wrap={false} style={elegantStyles.section}>
          <Text style={[elegantStyles.sectionTitle, elegantStyles.sectionTitleWithLine]}>
            Languages
          </Text>
          {data.languages.map((language) => (
            <View key={language.id} style={elegantStyles.languageItem}>
              <Text style={elegantStyles.languageName}>{language.name}</Text>
              <Text style={elegantStyles.languageLevel}>
                {language.proficiency || 'Basic'}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}