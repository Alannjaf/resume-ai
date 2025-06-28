import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { styles } from '../styles/developerStyles'
import { ResumeData } from '../../../types/resume'
import { formatDateRange } from '../utils/dateUtils'
import { parseDeveloperHtmlToPdf } from '../utils/developerHtmlParser'

interface DeveloperContentProps {
  data: ResumeData
}

export const DeveloperContent: React.FC<DeveloperContentProps> = ({ data }) => {
  return (
    <View style={styles.container}>
      {/* Summary Section */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'<summary>'}</Text>
          <Text style={styles.commentLine}>{`// ${data.summary}`}</Text>
        </View>
      )}

      {/* Experience Section */}
      {data.experience && data.experience.length > 0 && (
        <View style={styles.section}>
          {data.experience.map((exp, index) => {
            if (index === 0) {
              return (
                <View key={exp.id} style={styles.experienceItem}>
                  <View wrap={false}>
                    <Text style={styles.sectionTitle}>{'<experience>'}</Text>
                    <Text style={styles.jobTitle}>-{exp.jobTitle}</Text>
                    <Text style={styles.company}>@{exp.company}, {exp.location}</Text>
                    <Text style={styles.dateRange}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                  </View>
                  {exp.description && (
                    <View style={{ marginTop: 2 }}>
                      {parseDeveloperHtmlToPdf(exp.description, styles).elements}
                    </View>
                  )}
                </View>
              )
            } else {
              return (
                <View key={exp.id} style={styles.experienceItem} wrap={false}>
                  <Text style={styles.jobTitle}>-{exp.jobTitle}</Text>
                  <Text style={styles.company}>@{exp.company}, {exp.location}</Text>
                  <Text style={styles.dateRange}>{formatDateRange(exp.startDate, exp.endDate, exp.current)}</Text>
                  {exp.description && (
                    <View style={{ marginTop: 2 }}>
                      {parseDeveloperHtmlToPdf(exp.description, styles).elements}
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'<education>'}</Text>
          {data.education.map((edu) => (
            <View key={edu.id} wrap={false} style={styles.educationItem}>
              <Text style={styles.degree}>{`// ${edu.degree}`}</Text>
              <Text style={styles.school}>{`// ${edu.school}, ${edu.location}`}</Text>
              <Text style={styles.educationDetails}>{`// ${formatDateRange(edu.startDate, edu.endDate, false)}`}</Text>
              {edu.achievements && (
                <View style={{ marginTop: 2 }}>
                  {parseDeveloperHtmlToPdf(edu.achievements, styles).elements}
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <View wrap={false} style={styles.section}>
          <Text style={styles.sectionTitle}>{'<skills>'}</Text>
          {data.skills.map((skill) => (
            <Text key={skill.id} style={styles.skillItem}>
              {`// ${skill.name}${skill.level ? `: ${skill.level}` : ''}`}
            </Text>
          ))}
        </View>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{'<projects>'}</Text>
          {data.projects.map((project) => (
            <View key={project.id} wrap={false} style={styles.projectItem}>
              <Text style={styles.projectName}>-{project.name}</Text>
              <Text style={styles.projectTech}>{`// ${project.technologies || 'N/A'}`}</Text>
              <View style={{ marginTop: 1 }}>
                {parseDeveloperHtmlToPdf(project.description || '', styles).elements}
              </View>
              {project.link && (
                <Text style={styles.projectLink}>{`// ${project.link}`}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Languages Section */}
      {data.languages && data.languages.length > 0 && (
        <View wrap={false} style={styles.section}>
          <Text style={styles.sectionTitle}>{'<languages>'}</Text>
          {data.languages.map((language) => (
            <View key={language.id} style={styles.languageItem}>
              <Text>{`// ${language.name}: ${language.proficiency}`}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}