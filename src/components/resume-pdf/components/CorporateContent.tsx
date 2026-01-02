import { Text, View } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { corporateStyles } from '../styles/corporateStyles'
import { formatDate } from '../utils/dateUtils'
import { parseHtmlToPdf } from '../utils/htmlToPdfParser'

interface CorporateContentProps {
  data: ResumeData
}

export const CorporateContent = ({ data }: CorporateContentProps) => {
  // Experience Section
  const renderExperience = () => {
    if (!data.experience || data.experience.length === 0) return null

    return (
      <View style={corporateStyles.section}>
        {data.experience.map((exp, index) => {
          if (index === 0) {
            return (
              <View key={exp.id} style={corporateStyles.experienceItem}>
                <View wrap={false}>
                  <Text style={corporateStyles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
                  <View style={corporateStyles.experienceHeader}>
                    <Text style={corporateStyles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={corporateStyles.dateRange}>
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </Text>
                  </View>
                  <View style={corporateStyles.companyInfo}>
                    <Text style={corporateStyles.company}>{exp.company}</Text>
                    {exp.location && <Text style={corporateStyles.location}>{exp.location}</Text>}
                  </View>
                </View>
                {exp.description && (
                  <View style={{ marginTop: 4 }}>
                    {parseHtmlToPdf(exp.description, { 
                      text: { fontSize: 9, color: '#1e293b', lineHeight: 1.4 }
                    }).elements}
                  </View>
                )}
              </View>
            )
          } else {
            return (
              <View key={exp.id} style={corporateStyles.experienceItem} wrap={false}>
                <View style={corporateStyles.experienceHeader}>
                  <Text style={corporateStyles.jobTitle}>{exp.jobTitle}</Text>
                  <Text style={corporateStyles.dateRange}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                  </Text>
                </View>
                <View style={corporateStyles.companyInfo}>
                  <Text style={corporateStyles.company}>{exp.company}</Text>
                  {exp.location && <Text style={corporateStyles.location}>{exp.location}</Text>}
                </View>
                {exp.description && (
                  <View style={{ marginTop: 4 }}>
                    {parseHtmlToPdf(exp.description, { 
                      text: { fontSize: 9, color: '#1e293b', lineHeight: 1.4 }
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
      <View style={corporateStyles.section}>
        {data.education.map((edu, index) => (
          <View key={edu.id} style={corporateStyles.educationItem} wrap={false}>
            {index === 0 && (
              <Text style={corporateStyles.sectionTitle}>EDUCATION</Text>
            )}
            <View style={corporateStyles.educationHeader} wrap={false}>
              <Text style={corporateStyles.degree}>{edu.degree}</Text>
              <Text style={corporateStyles.dateRange}>
                {formatDate(edu.startDate)} - {formatDate(edu.endDate || '')}
              </Text>
            </View>
            <Text style={corporateStyles.school}>{edu.school}</Text>
            {edu.field && <Text style={corporateStyles.field}>{edu.field}</Text>}
            {edu.location && <Text style={corporateStyles.field}>{edu.location}</Text>}
            {edu.gpa && <Text style={corporateStyles.gpa}>GPA: {edu.gpa}</Text>}
            {edu.achievements && (
              <View style={{ marginTop: 2 }}>
                {parseHtmlToPdf(edu.achievements, { 
                  text: { fontSize: 9, color: '#1e293b', lineHeight: 1.4 }
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
      <View style={corporateStyles.section} wrap={false}>
        <Text style={corporateStyles.sectionTitle}>CORE COMPETENCIES</Text>
        <View style={corporateStyles.skillsGrid}>
          {data.skills.map((skill, index) => (
            <Text key={skill.id} style={corporateStyles.skillItem}>
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
      <View style={corporateStyles.section}>
        {data.projects.map((project, index) => (
          <View key={project.id} style={corporateStyles.projectItem} wrap={false}>
            {index === 0 && (
              <Text style={corporateStyles.sectionTitle}>PROJECTS</Text>
            )}
            <Text style={corporateStyles.projectName}>{project.name}</Text>
            {project.description && (
              <Text style={corporateStyles.projectDescription}>{project.description}</Text>
            )}
            {project.technologies && (
              <Text style={corporateStyles.projectTech}>Technologies: {project.technologies}</Text>
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
      <View style={corporateStyles.section}>
        {data.certifications.map((cert, index) => (
          <View key={cert.id} style={corporateStyles.certItem} wrap={false}>
            {index === 0 && (
              <Text style={corporateStyles.sectionTitle}>CERTIFICATIONS</Text>
            )}
            <Text style={corporateStyles.certName}>{cert.name}</Text>
            <Text style={corporateStyles.certIssuer}>{cert.issuer}</Text>
            {cert.date && (
              <Text style={corporateStyles.field}>{cert.date}</Text>
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
      <View style={corporateStyles.section} wrap={false}>
        <Text style={corporateStyles.sectionTitle}>LANGUAGES</Text>
        <View style={corporateStyles.languagesRow}>
          {data.languages.map((lang) => (
            <View key={lang.id} style={corporateStyles.languageChip}>
              <Text style={corporateStyles.languageName}>{lang.name}</Text>
              <Text style={corporateStyles.languageLevel}>({lang.proficiency})</Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={corporateStyles.contentContainer}>
      {renderExperience()}
      {renderEducation()}
      {renderSkills()}
      {renderProjects()}
      {renderCertifications()}
      {renderLanguages()}
    </View>
  )
}

