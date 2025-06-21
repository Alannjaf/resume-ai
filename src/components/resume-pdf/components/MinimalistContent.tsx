import { Text, View } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { minimalistStyles } from '../styles/minimalistStyles'
import { formatDate } from '../utils/dateUtils'

interface MinimalistContentProps {
  data: ResumeData
}

export const MinimalistContent = ({ data }: MinimalistContentProps) => {
  return (
    <View>
      {/* Professional Summary Section */}
      {data.summary && (
        <View style={minimalistStyles.section} wrap={false}>
          <Text style={minimalistStyles.sectionTitle}>Summary</Text>
          <Text style={minimalistStyles.summaryText}>{data.summary}</Text>
        </View>
      )}

      {/* Work Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <View style={minimalistStyles.section}>
          {data.experience.map((exp, index) => (
            <View key={exp.id} wrap={false}>
              {index === 0 && (
                <Text style={minimalistStyles.sectionTitle}>Experience</Text>
              )}
              <View style={minimalistStyles.experienceItem}>
                <View style={minimalistStyles.experienceHeader}>
                  <Text style={minimalistStyles.jobTitle}>{exp.jobTitle}</Text>
                  <Text style={minimalistStyles.dateRange}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </Text>
                </View>
                <Text style={minimalistStyles.company}>{exp.company}</Text>
                {exp.location && (
                  <Text style={minimalistStyles.location}>{exp.location}</Text>
                )}
                {exp.description && (
                  <Text style={minimalistStyles.description}>{exp.description}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <View style={minimalistStyles.section}>
          {data.education.map((edu, index) => (
            <View key={edu.id} wrap={false}>
              {index === 0 && (
                <Text style={minimalistStyles.sectionTitle}>Education</Text>
              )}
              <View style={minimalistStyles.educationItem}>
                <View style={minimalistStyles.educationHeader}>
                  <Text style={minimalistStyles.degree}>{edu.degree}</Text>
                  <Text style={minimalistStyles.dateRange}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
                <Text style={minimalistStyles.school}>{edu.school}</Text>
                {edu.field && <Text style={minimalistStyles.field}>{edu.field}</Text>}
                {edu.location && <Text style={minimalistStyles.location}>{edu.location}</Text>}
                {edu.gpa && <Text style={minimalistStyles.gpa}>GPA: {edu.gpa}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <View style={minimalistStyles.section} wrap={false}>
          <Text style={minimalistStyles.sectionTitle}>Skills</Text>
          <View style={minimalistStyles.skillsContainer}>
            {data.skills.map((skill, index) => (
              <View key={skill.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={minimalistStyles.skillText}>{skill.name}</Text>
                {index < data.skills.length - 1 && (
                  <Text style={minimalistStyles.skillSeparator}>•</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <View style={minimalistStyles.section}>
          {data.projects.map((project, index) => (
            <View key={project.id} wrap={false}>
              {index === 0 && (
                <Text style={minimalistStyles.sectionTitle}>Projects</Text>
              )}
              <View style={minimalistStyles.experienceItem}>
                <View style={minimalistStyles.experienceHeader}>
                  <Text style={minimalistStyles.jobTitle}>{project.name}</Text>
                  {(project.startDate || project.endDate) && (
                    <Text style={minimalistStyles.dateRange}>
                      {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                    </Text>
                  )}
                </View>
                {project.technologies && (
                  <Text style={minimalistStyles.company}>Technologies: {project.technologies}</Text>
                )}
                {project.description && (
                  <Text style={minimalistStyles.description}>{project.description}</Text>
                )}
                {project.link && (
                  <Text style={minimalistStyles.location}>{project.link}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Certifications Section */}
      {data.certifications && data.certifications.length > 0 && (
        <View style={minimalistStyles.section}>
          {data.certifications.map((cert, index) => (
            <View key={cert.id} wrap={false}>
              {index === 0 && (
                <Text style={minimalistStyles.sectionTitle}>Certifications</Text>
              )}
              <View style={minimalistStyles.educationItem}>
                <View style={minimalistStyles.educationHeader}>
                  <Text style={minimalistStyles.degree}>{cert.name}</Text>
                  {cert.date && (
                    <Text style={minimalistStyles.dateRange}>
                      {formatDate(cert.date)}
                    </Text>
                  )}
                </View>
                <Text style={minimalistStyles.school}>{cert.issuer}</Text>
                {cert.credentialId && <Text style={minimalistStyles.field}>ID: {cert.credentialId}</Text>}
                {cert.url && <Text style={minimalistStyles.location}>{cert.url}</Text>}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Languages Section */}
      {data.languages && data.languages.length > 0 && (
        <View wrap={false} style={minimalistStyles.section}>
          <Text style={minimalistStyles.sectionTitle}>Languages</Text>
          <View style={minimalistStyles.languagesContainer}>
            {data.languages.map((language, index) => (
              <View key={language.id} style={minimalistStyles.languageItem}>
                <Text style={minimalistStyles.languageName}>{language.name}</Text>
                <Text style={minimalistStyles.languageLevel}>
                  ({language.proficiency || 'Basic'})
                </Text>
                {index < data.languages.length - 1 && (
                  <Text style={minimalistStyles.languageSeparator}>•</Text>
                )}
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}