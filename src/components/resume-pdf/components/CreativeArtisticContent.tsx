import { Text, View } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { creativeArtisticStyles } from '../styles/creativeArtisticStyles'
import { formatDate } from '../utils/dateUtils'
import { parseHtmlToPdf } from '../utils/htmlToPdfParser'

interface CreativeArtisticContentProps {
  data: ResumeData
}

export const CreativeArtisticContent = ({ data }: CreativeArtisticContentProps) => {
  return (
    <View style={creativeArtisticStyles.content}>
      {/* Professional Summary Section */}
      {data.summary && (
        <View style={creativeArtisticStyles.section} wrap={false}>
          <View style={creativeArtisticStyles.sectionHeader}>
            <View style={creativeArtisticStyles.sectionIcon} />
            <Text style={creativeArtisticStyles.sectionTitle}>Professional Summary</Text>
          </View>
          <View style={creativeArtisticStyles.sectionDivider} />
          <View style={creativeArtisticStyles.summaryCard}>
            <Text style={creativeArtisticStyles.summaryText}>{data.summary}</Text>
          </View>
        </View>
      )}

      {/* Work Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <View style={creativeArtisticStyles.section}>
          {data.experience.map((exp, index) => {
            if (index === 0) {
              return (
                <View key={exp.id} style={creativeArtisticStyles.experienceItem}>
                  <View wrap={false}>
                    <View style={creativeArtisticStyles.sectionHeader}>
                      <View style={creativeArtisticStyles.sectionIcon} />
                      <Text style={creativeArtisticStyles.sectionTitle}>Work Experience</Text>
                    </View>
                    <View style={creativeArtisticStyles.sectionDivider} />
                    <View style={creativeArtisticStyles.experienceHeader}>
                      <View style={creativeArtisticStyles.jobTitleContainer}>
                        <Text style={creativeArtisticStyles.jobTitle}>{exp.jobTitle}</Text>
                        <Text style={creativeArtisticStyles.company}>{exp.company}</Text>
                      </View>
                      <View style={creativeArtisticStyles.dateContainer}>
                        <Text style={creativeArtisticStyles.dateRange}>
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                        </Text>
                        {exp.location && (
                          <Text style={creativeArtisticStyles.location}>{exp.location}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                  {exp.description && (
                    <View style={{ marginTop: 2 }}>
                      {parseHtmlToPdf(exp.description, { 
                        text: { fontSize: 10, color: '#4b5563', lineHeight: 1.4 }
                      }).elements}
                    </View>
                  )}
                </View>
              )
            } else {
              return (
                <View key={exp.id} style={creativeArtisticStyles.experienceItem} wrap={false}>
                  <View style={creativeArtisticStyles.experienceHeader}>
                    <View style={creativeArtisticStyles.jobTitleContainer}>
                      <Text style={creativeArtisticStyles.jobTitle}>{exp.jobTitle}</Text>
                      <Text style={creativeArtisticStyles.company}>{exp.company}</Text>
                    </View>
                    <View style={creativeArtisticStyles.dateContainer}>
                      <Text style={creativeArtisticStyles.dateRange}>
                        {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                      </Text>
                      {exp.location && (
                        <Text style={creativeArtisticStyles.location}>{exp.location}</Text>
                      )}
                    </View>
                  </View>
                  {exp.description && (
                    <View style={{ marginTop: 2 }}>
                      {parseHtmlToPdf(exp.description, { 
                        text: { fontSize: 10, color: '#4b5563', lineHeight: 1.4 }
                      }).elements}
                    </View>
                  )}
                </View>
              )
            }
          })}
        </View>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <View style={creativeArtisticStyles.section}>
          {data.education.map((edu, index) => {
            if (index === 0) {
              return (
                <View key={edu.id} style={creativeArtisticStyles.educationItem}>
                  <View wrap={false}>
                    <View style={creativeArtisticStyles.sectionHeader}>
                      <View style={creativeArtisticStyles.sectionIcon} />
                      <Text style={creativeArtisticStyles.sectionTitle}>Education</Text>
                    </View>
                    <View style={creativeArtisticStyles.sectionDivider} />
                    <View style={creativeArtisticStyles.educationHeader}>
                      <Text style={creativeArtisticStyles.degree}>{edu.degree}</Text>
                      <Text style={creativeArtisticStyles.dateRange}>
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate || '')}
                      </Text>
                    </View>
                    <Text style={creativeArtisticStyles.school}>{edu.school}</Text>
                    {edu.field && <Text style={creativeArtisticStyles.field}>{edu.field}</Text>}
                    {edu.location && <Text style={creativeArtisticStyles.location}>{edu.location}</Text>}
                    {edu.gpa && <Text style={creativeArtisticStyles.gpa}>GPA: {edu.gpa}</Text>}
                  </View>
                  {edu.achievements && (
                    <View style={{ marginTop: 2 }}>
                      {parseHtmlToPdf(edu.achievements, { 
                        text: { fontSize: 10, color: '#4b5563', lineHeight: 1.4 }
                      }).elements}
                    </View>
                  )}
                </View>
              )
            } else {
              return (
                <View key={edu.id} style={creativeArtisticStyles.educationItem} wrap={false}>
                  <View style={creativeArtisticStyles.educationHeader}>
                    <Text style={creativeArtisticStyles.degree}>{edu.degree}</Text>
                    <Text style={creativeArtisticStyles.dateRange}>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate || '')}
                    </Text>
                  </View>
                  <Text style={creativeArtisticStyles.school}>{edu.school}</Text>
                  {edu.field && <Text style={creativeArtisticStyles.field}>{edu.field}</Text>}
                  {edu.location && <Text style={creativeArtisticStyles.location}>{edu.location}</Text>}
                  {edu.gpa && <Text style={creativeArtisticStyles.gpa}>GPA: {edu.gpa}</Text>}
                  {edu.achievements && (
                    <View style={{ marginTop: 2 }}>
                      {parseHtmlToPdf(edu.achievements, { 
                        text: { fontSize: 10, color: '#4b5563', lineHeight: 1.4 }
                      }).elements}
                    </View>
                  )}
                </View>
              )
            }
          })}
        </View>
      )}

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <View style={creativeArtisticStyles.section} wrap={false}>
          <View style={creativeArtisticStyles.sectionHeader}>
            <View style={creativeArtisticStyles.sectionIcon} />
            <Text style={creativeArtisticStyles.sectionTitle}>Skills & Expertise</Text>
          </View>
          <View style={creativeArtisticStyles.sectionDivider} />
          <View style={creativeArtisticStyles.skillsGrid}>
            {data.skills.map((skill) => (
              <View key={skill.id} style={creativeArtisticStyles.skillChip}>
                <Text style={creativeArtisticStyles.skillText}>{skill.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <View style={creativeArtisticStyles.section}>
          {data.projects.map((project, index) => {
            if (index === 0) {
              return (
                <View key={project.id} style={creativeArtisticStyles.experienceItem}>
                  <View wrap={false}>
                    <View style={creativeArtisticStyles.sectionHeader}>
                      <View style={creativeArtisticStyles.sectionIcon} />
                      <Text style={creativeArtisticStyles.sectionTitle}>Notable Projects</Text>
                    </View>
                    <View style={creativeArtisticStyles.sectionDivider} />
                    <View style={creativeArtisticStyles.experienceHeader}>
                      <View style={creativeArtisticStyles.jobTitleContainer}>
                        <Text style={creativeArtisticStyles.jobTitle}>{project.name}</Text>
                        {project.technologies && (
                          <Text style={creativeArtisticStyles.company}>Technologies: {project.technologies}</Text>
                        )}
                      </View>
                      <View style={creativeArtisticStyles.dateContainer}>
                        {(project.startDate || project.endDate) && (
                          <Text style={creativeArtisticStyles.dateRange}>
                            {formatDate(project.startDate || '')} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                          </Text>
                        )}
                        {project.link && (
                          <Text style={creativeArtisticStyles.location}>{project.link}</Text>
                        )}
                      </View>
                    </View>
                  </View>
                  {project.description && (
                    <View style={{ marginTop: 2 }}>
                      {parseHtmlToPdf(project.description, { 
                        text: { fontSize: 10, color: '#4b5563', lineHeight: 1.4 }
                      }).elements}
                    </View>
                  )}
                </View>
              )
            } else {
              return (
                <View key={project.id} style={creativeArtisticStyles.experienceItem} wrap={false}>
                  <View style={creativeArtisticStyles.experienceHeader}>
                    <View style={creativeArtisticStyles.jobTitleContainer}>
                      <Text style={creativeArtisticStyles.jobTitle}>{project.name}</Text>
                      {project.technologies && (
                        <Text style={creativeArtisticStyles.company}>Technologies: {project.technologies}</Text>
                      )}
                    </View>
                    <View style={creativeArtisticStyles.dateContainer}>
                      {(project.startDate || project.endDate) && (
                        <Text style={creativeArtisticStyles.dateRange}>
                          {formatDate(project.startDate || '')} - {project.endDate ? formatDate(project.endDate) : 'Present'}
                        </Text>
                      )}
                      {project.link && (
                        <Text style={creativeArtisticStyles.location}>{project.link}</Text>
                      )}
                    </View>
                  </View>
                  {project.description && (
                    <View style={{ marginTop: 2 }}>
                      {parseHtmlToPdf(project.description, { 
                        text: { fontSize: 10, color: '#4b5563', lineHeight: 1.4 }
                      }).elements}
                    </View>
                  )}
                </View>
              )
            }
          })}
        </View>
      )}

      {/* Certifications Section */}
      {data.certifications && data.certifications.length > 0 && (
        <View style={creativeArtisticStyles.section}>
          {data.certifications.map((cert, index) => {
            if (index === 0) {
              return (
                <View key={cert.id} style={creativeArtisticStyles.educationItem}>
                  <View wrap={false}>
                    <View style={creativeArtisticStyles.sectionHeader}>
                      <View style={creativeArtisticStyles.sectionIcon} />
                      <Text style={creativeArtisticStyles.sectionTitle}>Certifications</Text>
                    </View>
                    <View style={creativeArtisticStyles.sectionDivider} />
                    <View style={creativeArtisticStyles.educationHeader}>
                      <Text style={creativeArtisticStyles.degree}>{cert.name}</Text>
                      {cert.date && (
                        <Text style={creativeArtisticStyles.dateRange}>
                          {formatDate(cert.date)}
                        </Text>
                      )}
                    </View>
                    <Text style={creativeArtisticStyles.school}>{cert.issuer}</Text>
                    {cert.credentialId && <Text style={creativeArtisticStyles.field}>ID: {cert.credentialId}</Text>}
                    {cert.url && <Text style={creativeArtisticStyles.location}>{cert.url}</Text>}
                  </View>
                </View>
              )
            } else {
              return (
                <View key={cert.id} style={creativeArtisticStyles.educationItem} wrap={false}>
                  <View style={creativeArtisticStyles.educationHeader}>
                    <Text style={creativeArtisticStyles.degree}>{cert.name}</Text>
                    {cert.date && (
                      <Text style={creativeArtisticStyles.dateRange}>
                        {formatDate(cert.date)}
                      </Text>
                    )}
                  </View>
                  <Text style={creativeArtisticStyles.school}>{cert.issuer}</Text>
                  {cert.credentialId && <Text style={creativeArtisticStyles.field}>ID: {cert.credentialId}</Text>}
                  {cert.url && <Text style={creativeArtisticStyles.location}>{cert.url}</Text>}
                </View>
              )
            }
          })}
        </View>
      )}

      {/* Languages Section */}
      {data.languages && data.languages.length > 0 && (
        <View wrap={false} style={creativeArtisticStyles.section}>
          <View style={creativeArtisticStyles.sectionHeader}>
            <View style={creativeArtisticStyles.sectionIcon} />
            <Text style={creativeArtisticStyles.sectionTitle}>Languages</Text>
          </View>
          <View style={creativeArtisticStyles.sectionDivider} />
          <View style={creativeArtisticStyles.languagesContainer}>
            <View style={creativeArtisticStyles.languageGrid}>
              {data.languages.map((language) => (
                <View key={language.id} style={creativeArtisticStyles.languageItem}>
                  <View style={creativeArtisticStyles.languageDot} />
                  <Text style={creativeArtisticStyles.languageName}>{language.name}</Text>
                  <Text style={creativeArtisticStyles.languageLevel}>
                    ({language.proficiency || 'Basic'})
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  )
}