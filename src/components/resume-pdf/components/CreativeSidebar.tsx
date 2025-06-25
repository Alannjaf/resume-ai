import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { sectionStyles } from '../styles/creativeSectionStyles'
import { sidebarStyles } from '../styles/creativeSidebarStyles'
import { ResumeData } from '../../../types/resume'
import { formatDateRange } from '../utils/dateUtils'
import { parseHtmlToPdf } from '../utils/htmlToPdfParser'

interface CreativeSidebarProps {
  data: ResumeData
}

export const CreativeSidebar: React.FC<CreativeSidebarProps> = ({ data }) => {
  return (
    <View>
      {/* Skills Section */}
      {data.skills && data.skills.length > 0 && (
        <View style={sectionStyles.section} wrap={false}>
          <View style={sectionStyles.sectionTitleContainer}>
            <Text style={sectionStyles.sectionTitle}>Skills</Text>
            <View style={sectionStyles.sectionUnderline} />
          </View>
          <View style={sidebarStyles.skillsGrid}>
            {data.skills.map((skill) => (
              <Text key={skill.id} style={sidebarStyles.skillChip}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Education Section */}
      {data.education && data.education.length > 0 && (
        <View style={sectionStyles.section}>
          {data.education.map((edu, index) => {
            if (index === 0) {
              return (
                <View key={edu.id} style={sidebarStyles.educationItem}>
                  <View wrap={false}>
                    <View style={sectionStyles.sectionTitleContainer}>
                      <Text style={sectionStyles.sectionTitle}>Education</Text>
                      <View style={sectionStyles.sectionUnderline} />
                    </View>
                    <Text style={sidebarStyles.degree}>{edu.degree}</Text>
                    {edu.field && <Text style={sidebarStyles.field}>{edu.field}</Text>}
                    <Text style={sidebarStyles.school}>{edu.school}</Text>
                    <Text style={sidebarStyles.educationMeta}>
                      {edu.location} • {formatDateRange(edu.startDate, edu.endDate, false)}
                    </Text>
                    {edu.gpa && <Text style={sidebarStyles.gpa}>GPA: {edu.gpa}</Text>}
                  </View>
                  {edu.achievements && (
                    <View style={{ marginTop: 2 }}>
                      {parseHtmlToPdf(edu.achievements, { 
                        text: { fontSize: 9, color: '#4b5563', lineHeight: 1.4 }
                      }).elements}
                    </View>
                  )}
                </View>
              )
            } else {
              return (
                <View key={edu.id} style={sidebarStyles.educationItem} wrap={false}>
                  <Text style={sidebarStyles.degree}>{edu.degree}</Text>
                  {edu.field && <Text style={sidebarStyles.field}>{edu.field}</Text>}
                  <Text style={sidebarStyles.school}>{edu.school}</Text>
                  <Text style={sidebarStyles.educationMeta}>
                    {edu.location} • {formatDateRange(edu.startDate, edu.endDate, false)}
                  </Text>
                  {edu.gpa && <Text style={sidebarStyles.gpa}>GPA: {edu.gpa}</Text>}
                  {edu.achievements && (
                    <View style={{ marginTop: 2 }}>
                      {parseHtmlToPdf(edu.achievements, { 
                        text: { fontSize: 9, color: '#4b5563', lineHeight: 1.4 }
                      }).elements}
                    </View>
                  )}
                </View>
              )
            }
          })}
        </View>
      )}

      {/* Languages Section */}
      {data.languages && data.languages.length > 0 && (
        <View wrap={false} style={sectionStyles.section}>
          <View style={sectionStyles.sectionTitleContainer}>
            <Text style={sectionStyles.sectionTitle}>Languages</Text>
            <View style={sectionStyles.sectionUnderline} />
          </View>
          {data.languages.map((language) => (
            <View key={language.id} style={sidebarStyles.languageItem}>
              <Text style={sidebarStyles.languageName}>{language.name}</Text>
              <Text style={sidebarStyles.languageLevel}>{language.proficiency || 'Basic'}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}