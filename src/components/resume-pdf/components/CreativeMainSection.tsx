import React from 'react'
import { View, Text, Link } from '@react-pdf/renderer'
import { sectionStyles } from '../styles/creativeSectionStyles'
import { sidebarStyles } from '../styles/creativeSidebarStyles'
import { ResumeData } from '../../../types/resume'
import { formatDateRange } from '../utils/dateUtils'
import { parseHtmlToPdf } from '../utils/htmlToPdfParser'

interface CreativeMainSectionProps {
  data: ResumeData
}

export const CreativeMainSection: React.FC<CreativeMainSectionProps> = ({ data }) => {
  const experiences = data.experience || []

  return (
    <View>
      {/* Summary Section */}
      {data.summary && (
        <View style={sectionStyles.section} wrap={false}>
          <View style={sectionStyles.sectionTitleContainer}>
            <Text style={sectionStyles.sectionTitle}>About Me</Text>
            <View style={sectionStyles.sectionUnderline} />
          </View>
          <Text style={sectionStyles.summary}>{data.summary}</Text>
        </View>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <View style={sectionStyles.section}>
          {experiences.map((exp, index) => (
            <View key={exp.id} wrap={false}>
              {index === 0 && (
                <View style={sectionStyles.sectionTitleContainer}>
                  <Text style={sectionStyles.sectionTitle}>Experience</Text>
                  <View style={sectionStyles.sectionUnderline} />
                </View>
              )}
              <View style={sectionStyles.experienceItem}>
                <View style={sectionStyles.experienceHeader}>
                  <Text style={sectionStyles.jobTitle}>{exp.jobTitle}</Text>
                  <Text style={sectionStyles.company}>{exp.company}</Text>
                  <View style={sectionStyles.jobMeta}>
                    <Text style={sectionStyles.location}>{exp.location}</Text>
                    <Text style={sectionStyles.duration}>
                      {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                    </Text>
                  </View>
                </View>
                <View style={{ marginTop: 2 }}>
                  {parseHtmlToPdf(exp.description, { 
                    text: { fontSize: 10, color: '#4b5563', lineHeight: 1.4 }
                  }).elements}
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <View style={sectionStyles.section}>
          {data.projects.map((project, index) => (
            <View key={project.id} wrap={false}>
              {index === 0 && (
                <View style={sectionStyles.sectionTitleContainer}>
                  <Text style={sectionStyles.sectionTitle}>Projects</Text>
                  <View style={sectionStyles.sectionUnderline} />
                </View>
              )}
              <View style={sidebarStyles.projectItem}>
                <Text style={sidebarStyles.projectName}>{project.name}</Text>
                {project.description && (
                  <View style={{ marginTop: 2 }}>
                    {parseHtmlToPdf(project.description, { 
                      text: { fontSize: 10, color: '#4b5563', lineHeight: 1.4 }
                    }).elements}
                  </View>
                )}
                {project.technologies && (
                  <Text style={sidebarStyles.projectTech}>
                    Technologies: {project.technologies}
                  </Text>
                )}
                {project.link && (
                  <Link src={project.link} style={sidebarStyles.projectLink}>
                    View Project
                  </Link>
                )}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Certifications Section */}
      {data.certifications && data.certifications.length > 0 && (
        <View style={sectionStyles.section}>
          {data.certifications.map((cert, index) => (
            <View key={cert.id} wrap={false}>
              {index === 0 && (
                <View style={sectionStyles.sectionTitleContainer}>
                  <Text style={sectionStyles.sectionTitle}>Certifications</Text>
                  <View style={sectionStyles.sectionUnderline} />
                </View>
              )}
              <View style={sidebarStyles.certificationItem}>
                <Text style={sidebarStyles.certificationName}>{cert.name}</Text>
                <Text style={sidebarStyles.certificationIssuer}>{cert.issuer}</Text>
                {cert.date && (
                  <Text style={sidebarStyles.certificationDate}>
                    {new Date(cert.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}