import { Text, View } from '@react-pdf/renderer'
import { Project } from '@/types/resume'
import { executiveStyles } from '../styles/executiveStyles'
import { formatDate } from '../utils/dateUtils'
import { parseHtmlToPdf } from '../utils/htmlToPdfParser'

interface ExecutiveProjectsProps {
  projects: Project[]
}

export const ExecutiveProjects = ({ projects }: ExecutiveProjectsProps) => {
  if (!projects || projects.length === 0) return null

  return (
    <View style={executiveStyles.section}>
      {projects.map((project, index) => (
        <View key={project.id} style={executiveStyles.experienceItem} wrap={false}>
          {index === 0 && (
            <Text style={executiveStyles.sectionTitle}>NOTABLE PROJECTS</Text>
          )}
          <View style={executiveStyles.experienceHeader} wrap={false}>
            <Text style={executiveStyles.jobTitle}>{project.name}</Text>
            {(project.startDate || project.endDate) && (
              <Text style={executiveStyles.dateRange}>
                {formatDate(project.startDate || '')} - {project.endDate ? formatDate(project.endDate) : 'Present'}
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
            <View style={{ marginTop: 2 }}>
              {parseHtmlToPdf(project.description, { 
                text: { fontSize: 10, color: '#374151', lineHeight: 1.4 }
              }).elements}
            </View>
          )}
        </View>
      ))}
    </View>
  )
}