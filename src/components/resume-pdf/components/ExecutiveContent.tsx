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
            <View key={exp.id}>
              {index === 0 && (
                <View wrap={false}>
                  <Text style={executiveStyles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
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
              )}
              {index > 0 && (
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
              )}
            </View>
          ))}
        </View>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <View style={executiveStyles.section}>
          {data.education.map((edu, index) => (
            <View key={edu.id}>
              {index === 0 && (
                <View wrap={false}>
                  <Text style={executiveStyles.sectionTitle}>EDUCATION</Text>
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
              )}
              {index > 0 && (
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
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <View style={executiveStyles.section}>
          <Text style={executiveStyles.sectionTitle}>CORE COMPETENCIES</Text>
          <View style={executiveStyles.skillsGrid} wrap={false}>
            {data.skills.map((skill, index) => (
              <Text key={skill.id} style={executiveStyles.skillItem}>
                {skill.name}
                {index < data.skills!.length - 1 && ' • '}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <View style={executiveStyles.section}>
          {data.projects.map((project, index) => (
            <View key={project.id}>
              {index === 0 && (
                <View wrap={false}>
                  <Text style={executiveStyles.sectionTitle}>NOTABLE PROJECTS</Text>
                  <View style={executiveStyles.experienceItem}>
                    <View style={executiveStyles.experienceHeader}>
                      <Text style={executiveStyles.jobTitle}>{project.name}</Text>
                      {(project.startDate || project.endDate) && (
                        <Text style={executiveStyles.dateRange}>
                          {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                        </Text>
                      )}
                    </View>
                    <View style={executiveStyles.companyInfo}>
                      {project.technologies && (
                        <Text style={executiveStyles.company}>Technologies: {project.technologies}</Text>
                      )}
                      {project.link && <Text style={executiveStyles.location}>{project.link}</Text>}
                    </View>
                    {project.description && (
                      <Text style={executiveStyles.description}>{project.description}</Text>
                    )}
                  </View>
                </View>
              )}
              {index > 0 && (
                <View style={executiveStyles.experienceItem}>
                  <View style={executiveStyles.experienceHeader}>
                    <Text style={executiveStyles.jobTitle}>{project.name}</Text>
                    {(project.startDate || project.endDate) && (
                      <Text style={executiveStyles.dateRange}>
                        {formatDate(project.startDate)} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                      </Text>
                    )}
                  </View>
                  <View style={executiveStyles.companyInfo}>
                    {project.technologies && (
                      <Text style={executiveStyles.company}>Technologies: {project.technologies}</Text>
                    )}
                    {project.link && <Text style={executiveStyles.location}>{project.link}</Text>}
                  </View>
                  {project.description && (
                    <Text style={executiveStyles.description}>{project.description}</Text>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Certifications Section */}
      {data.certifications && data.certifications.length > 0 && (
        <View style={executiveStyles.section}>
          {data.certifications.map((cert, index) => (
            <View key={cert.id}>
              {index === 0 && (
                <View wrap={false}>
                  <Text style={executiveStyles.sectionTitle}>CERTIFICATIONS</Text>
                  <View style={executiveStyles.educationItem}>
                    <View style={executiveStyles.educationHeader}>
                      <Text style={executiveStyles.degree}>{cert.name}</Text>
                      {cert.date && (
                        <Text style={executiveStyles.dateRange}>
                          {formatDate(cert.date)}
                        </Text>
                      )}
                    </View>
                    <Text style={executiveStyles.school}>{cert.issuer}</Text>
                    {cert.credentialId && <Text style={executiveStyles.field}>ID: {cert.credentialId}</Text>}
                    {cert.url && <Text style={executiveStyles.location}>{cert.url}</Text>}
                  </View>
                </View>
              )}
              {index > 0 && (
                <View style={executiveStyles.educationItem}>
                  <View style={executiveStyles.educationHeader}>
                    <Text style={executiveStyles.degree}>{cert.name}</Text>
                    {cert.date && (
                      <Text style={executiveStyles.dateRange}>
                        {formatDate(cert.date)}
                      </Text>
                    )}
                  </View>
                  <Text style={executiveStyles.school}>{cert.issuer}</Text>
                  {cert.credentialId && <Text style={executiveStyles.field}>ID: {cert.credentialId}</Text>}
                  {cert.url && <Text style={executiveStyles.location}>{cert.url}</Text>}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Languages Section */}
      {data.languages && data.languages.length > 0 && (
        <View style={executiveStyles.section}>
          <Text style={executiveStyles.sectionTitle}>LANGUAGES</Text>
          <View style={executiveStyles.languagesRow} wrap={false}>
            {data.languages.map((language, index) => (
              <View key={language.id} style={executiveStyles.languageChip}>
                <Text style={executiveStyles.languageName}>{language.name}</Text>
                <Text style={executiveStyles.languageLevel}>({language.proficiency || 'Basic'})</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}