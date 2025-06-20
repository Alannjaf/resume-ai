import React from 'react'
import { View, Text, Link } from '@react-pdf/renderer'
import { styles } from '../styles/pdfStyles'
import { skillsStyles } from '../styles/skillsStyles'
import { experienceStyles } from '../styles/experienceStyles'
import { ResumeData } from '../../../types/resume'
import { formatDateRange } from '../utils/dateUtils'

interface RightColumnProps {
  data: ResumeData
  experiences: any[]
}

export const RightColumn: React.FC<RightColumnProps> = ({ data, experiences }) => {
  return (
    <View style={styles.rightColumn}>
      {/* Summary Section */}
      {data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summary}>{data.summary}</Text>
        </View>
      )}

      {/* Experience Section */}
      {experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {experiences.map((exp, index) => (
            <View 
              key={exp.id} 
              style={[
                experienceStyles.experienceItem,
                index === experiences.length - 1 ? { borderBottom: 'none' } : {}
              ]}
              wrap={false} // This ensures the entire experience stays together
            >
              <View style={experienceStyles.experienceHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={experienceStyles.jobTitle}>{exp.jobTitle}</Text>
                  <Text style={experienceStyles.company}>{exp.company}</Text>
                  <Text style={experienceStyles.jobLocation}>{exp.location}</Text>
                </View>
                <Text style={experienceStyles.duration}>
                  {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                </Text>
              </View>
              <Text style={experienceStyles.description}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Projects Section */}
      {data.projects && data.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notable Projects</Text>
          {data.projects.map((project) => (
            <View key={project.id} style={skillsStyles.projectItem} wrap={false}>
              <Text style={skillsStyles.projectName}>{project.name}</Text>
              {project.description && (
                <Text style={skillsStyles.projectDescription}>{project.description}</Text>
              )}
              {project.technologies && (
                <Text style={skillsStyles.projectTech}>Technologies: {project.technologies}</Text>
              )}
              {project.link && (
                <Link src={project.link} style={skillsStyles.projectLink}>
                  View Project
                </Link>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}