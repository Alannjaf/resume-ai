import { Text, View } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { creativeModernStyles } from '../styles/creativeModernStyles'
import { formatDate } from '../utils/dateUtils'
import { parseHtmlToPdf } from '../utils/htmlToPdfParser'

interface CreativeModernContentProps {
  data: ResumeData
}

export const CreativeModernContent = ({ data }: CreativeModernContentProps) => {
  // Experience Section
  const renderExperience = () => {
    if (!data.experience || data.experience.length === 0) return null

    return (
      <View style={creativeModernStyles.section}>
        {data.experience.map((exp, index) => {
          if (index === 0) {
            return (
              <View key={exp.id} style={creativeModernStyles.experienceItem}>
                <View wrap={false}>
                  <Text style={creativeModernStyles.sectionTitleAccent}>EXPERIENCE</Text>
                  <View style={creativeModernStyles.experienceHeader}>
                    <Text style={creativeModernStyles.jobTitle}>{exp.jobTitle}</Text>
                    <Text style={creativeModernStyles.dateRange}>
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                    </Text>
                  </View>
                  <View style={creativeModernStyles.companyInfo}>
                    <Text style={creativeModernStyles.company}>{exp.company}</Text>
                    {exp.location && <Text style={creativeModernStyles.location}>{exp.location}</Text>}
                  </View>
                </View>
                {exp.description && (
                  <View style={{ marginTop: 4 }}>
                    {parseHtmlToPdf(exp.description, { 
                      text: { fontSize: 9, color: '#1f2937', lineHeight: 1.4 }
                    }).elements}
                  </View>
                )}
              </View>
            )
          } else {
            return (
              <View key={exp.id} style={creativeModernStyles.experienceItem} wrap={false}>
                <View style={creativeModernStyles.experienceHeader}>
                  <Text style={creativeModernStyles.jobTitle}>{exp.jobTitle}</Text>
                  <Text style={creativeModernStyles.dateRange}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                  </Text>
                </View>
                <View style={creativeModernStyles.companyInfo}>
                  <Text style={creativeModernStyles.company}>{exp.company}</Text>
                  {exp.location && <Text style={creativeModernStyles.location}>{exp.location}</Text>}
                </View>
                {exp.description && (
                  <View style={{ marginTop: 4 }}>
                    {parseHtmlToPdf(exp.description, { 
                      text: { fontSize: 9, color: '#1f2937', lineHeight: 1.4 }
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
      <View style={creativeModernStyles.section}>
        {data.education.map((edu, index) => (
          <View key={edu.id} style={creativeModernStyles.educationItem} wrap={false}>
            {index === 0 && (
              <Text style={creativeModernStyles.sectionTitleAccent}>EDUCATION</Text>
            )}
            <View style={creativeModernStyles.educationHeader} wrap={false}>
              <Text style={creativeModernStyles.degree}>{edu.degree}</Text>
              <Text style={creativeModernStyles.dateRange}>
                {formatDate(edu.startDate)} - {formatDate(edu.endDate || '')}
              </Text>
            </View>
            <Text style={creativeModernStyles.school}>{edu.school}</Text>
            {edu.field && <Text style={creativeModernStyles.field}>{edu.field}</Text>}
            {edu.location && <Text style={creativeModernStyles.field}>{edu.location}</Text>}
            {edu.gpa && <Text style={creativeModernStyles.gpa}>GPA: {edu.gpa}</Text>}
            {edu.achievements && (
              <View style={{ marginTop: 2 }}>
                {parseHtmlToPdf(edu.achievements, { 
                  text: { fontSize: 9, color: '#1f2937', lineHeight: 1.4 }
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
      <View style={creativeModernStyles.section} wrap={false}>
        <Text style={creativeModernStyles.sectionTitleAccent}>SKILLS</Text>
        <View style={creativeModernStyles.skillsGrid}>
          {data.skills.map((skill) => (
            <Text key={skill.id} style={creativeModernStyles.skillItem}>
              {skill.name}
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
      <View style={creativeModernStyles.section}>
        {data.projects.map((project, index) => (
          <View key={project.id} style={creativeModernStyles.projectItem} wrap={false}>
            {index === 0 && (
              <Text style={creativeModernStyles.sectionTitleAccent}>PROJECTS</Text>
            )}
            <Text style={creativeModernStyles.projectName}>{project.name}</Text>
            {project.description && (
              <Text style={creativeModernStyles.projectDescription}>{project.description}</Text>
            )}
            {project.technologies && (
              <Text style={creativeModernStyles.projectTech}>{project.technologies}</Text>
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
      <View style={creativeModernStyles.section}>
        {data.certifications.map((cert, index) => (
          <View key={cert.id} style={creativeModernStyles.certItem} wrap={false}>
            {index === 0 && (
              <Text style={creativeModernStyles.sectionTitleAccent}>CERTIFICATIONS</Text>
            )}
            <Text style={creativeModernStyles.certName}>{cert.name}</Text>
            <Text style={creativeModernStyles.certIssuer}>{cert.issuer}</Text>
            {cert.date && (
              <Text style={creativeModernStyles.field}>{cert.date}</Text>
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
      <View style={creativeModernStyles.section} wrap={false}>
        <Text style={creativeModernStyles.sectionTitleAccent}>LANGUAGES</Text>
        <View style={creativeModernStyles.languagesRow}>
          {data.languages.map((lang) => (
            <View key={lang.id} style={creativeModernStyles.languageChip}>
              <Text style={creativeModernStyles.languageName}>{lang.name}</Text>
              <Text style={creativeModernStyles.languageLevel}>({lang.proficiency})</Text>
            </View>
          ))}
        </View>
      </View>
    )
  }

  return (
    <View style={creativeModernStyles.contentContainer}>
      {renderExperience()}
      {renderEducation()}
      {renderSkills()}
      {renderProjects()}
      {renderCertifications()}
      {renderLanguages()}
    </View>
  )
}

