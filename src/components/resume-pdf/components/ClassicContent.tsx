import { Text, View } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { classicStyles } from '../styles/classicStyles'
import { formatDate } from '../utils/dateUtils'
import { parseHtmlToPdf } from '../utils/htmlToPdfParser'

interface ClassicContentProps {
  data: ResumeData
}

export const ClassicContent = ({ data }: ClassicContentProps) => {
  // Experience Section
  const renderExperience = () => {
    if (!data.experience || data.experience.length === 0) return null

    return (
      <View style={classicStyles.section}>
        {data.experience.map((exp, index) => {
          if (index === 0) {
            return (
              <View key={exp.id} style={classicStyles.experienceItem}>
                <View wrap={false}>
                  <Text style={classicStyles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                  <View style={classicStyles.experienceHeader}>
                    <Text style={classicStyles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={classicStyles.dateRange}>
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </Text>
                  </View>
                  <View style={classicStyles.companyInfo}>
                    <Text style={classicStyles.company}>{exp.company}</Text>
                    {exp.location && <Text style={classicStyles.location}>{exp.location}</Text>}
                  </View>
                </View>
                {exp.description && (
                  <View style={{ marginTop: 6 }}>
                    {parseHtmlToPdf(exp.description, { 
                      text: { fontSize: 10, color: '#111827', lineHeight: 1.5 }
                    }).elements}
                  </View>
                )}
              </View>
            )
          } else {
            return (
              <View key={exp.id} style={classicStyles.experienceItem} wrap={false}>
                <View style={classicStyles.experienceHeader}>
                  <Text style={classicStyles.jobTitle}>{exp.jobTitle}</Text>
                  <Text style={classicStyles.dateRange}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                  </Text>
                </View>
                <View style={classicStyles.companyInfo}>
                  <Text style={classicStyles.company}>{exp.company}</Text>
                  {exp.location && <Text style={classicStyles.location}>{exp.location}</Text>}
                </View>
                {exp.description && (
                  <View style={{ marginTop: 6 }}>
                    {parseHtmlToPdf(exp.description, { 
                      text: { fontSize: 10, color: '#111827', lineHeight: 1.5 }
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

  // Education Section
  const renderEducation = () => {
    if (!data.education || data.education.length === 0) return null

    return (
      <View style={classicStyles.section}>
        {data.education.map((edu, index) => (
          <View key={edu.id} style={classicStyles.educationItem} wrap={false}>
            {index === 0 && (
              <Text style={classicStyles.sectionTitle}>EDUCATION</Text>
            )}
            <View style={classicStyles.educationHeader} wrap={false}>
              <Text style={classicStyles.degree}>{edu.degree}</Text>
              <Text style={classicStyles.dateRange}>
                {formatDate(edu.startDate)} - {formatDate(edu.endDate || '')}
              </Text>
            </View>
            <Text style={classicStyles.school}>{edu.school}</Text>
            {edu.field && <Text style={classicStyles.field}>{edu.field}</Text>}
            {edu.location && <Text style={classicStyles.location}>{edu.location}</Text>}
            {edu.gpa && <Text style={classicStyles.gpa}>GPA: {edu.gpa}</Text>}
            {edu.achievements && (
              <View style={{ marginTop: 4 }}>
                {parseHtmlToPdf(edu.achievements, { 
                  text: { fontSize: 10, color: '#111827', lineHeight: 1.5 }
                }).elements}
              </View>
            )}
          </View>
        ))}
      </View>
    )
  }

  // Skills Section
  const renderSkills = () => {
    if (!data.skills || data.skills.length === 0) return null

    return (
      <View style={classicStyles.section} wrap={false}>
        <Text style={classicStyles.sectionTitle}>CORE COMPETENCIES</Text>
        <View style={classicStyles.skillsGrid}>
          {data.skills.map((skill, index) => (
            <Text key={skill.id} style={classicStyles.skillItem}>
              {skill.name}
              {index < data.skills.length - 1 && ' • '}
            </Text>
          ))}
        </View>
      </View>
    )
  }

  // Projects Section
  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null

    return (
      <View style={classicStyles.section}>
        {data.projects.map((project, index) => (
          <View key={project.id} style={classicStyles.projectItem} wrap={false}>
            {index === 0 && (
              <Text style={classicStyles.sectionTitle}>PROJECTS</Text>
            )}
            <Text style={classicStyles.projectName}>{project.name}</Text>
            {project.description && (
              <Text style={classicStyles.projectDescription}>{project.description}</Text>
            )}
            {project.technologies && (
              <Text style={classicStyles.projectTech}>{project.technologies}</Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  // Certifications Section
  const renderCertifications = () => {
    if (!data.certifications || data.certifications.length === 0) return null

    return (
      <View style={classicStyles.section}>
        {data.certifications.map((cert, index) => (
          <View key={cert.id} style={classicStyles.certItem} wrap={false}>
            {index === 0 && (
              <Text style={classicStyles.sectionTitle}>CERTIFICATIONS</Text>
            )}
            <Text style={classicStyles.certName}>{cert.name}</Text>
            <Text style={classicStyles.certIssuer}>{cert.issuer}</Text>
            {cert.date && (
              <Text style={classicStyles.location}>{cert.date}</Text>
            )}
          </View>
        ))}
      </View>
    )
  }

  // Languages Section
  const renderLanguages = () => {
    if (!data.languages || data.languages.length === 0) return null

    return (
      <View style={classicStyles.section} wrap={false}>
        <Text style={classicStyles.sectionTitle}>LANGUAGES</Text>
        <View style={classicStyles.languagesRow}>
          {data.languages.map((lang) => (
            <View key={lang.id} style={classicStyles.languageChip}>
              <Text style={classicStyles.languageName}>{lang.name}</Text>
              <Text style={classicStyles.languageLevel}>({lang.proficiency})</Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={classicStyles.contentContainer}>
      {renderExperience()}
      {renderEducation()}
      {renderSkills()}
      {renderProjects()}
      {renderCertifications()}
      {renderLanguages()}
    </View>
  )
}

