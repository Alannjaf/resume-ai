import { View } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { executiveStyles } from '../styles/executiveStyles'
import { ExecutiveExperience } from './ExecutiveExperience'
import { ExecutiveEducation } from './ExecutiveEducation'
import { ExecutiveSkills } from './ExecutiveSkills'
import { ExecutiveProjects } from './ExecutiveProjects'
import { ExecutiveCertifications } from './ExecutiveCertifications'
import { ExecutiveLanguages } from './ExecutiveLanguages'

interface ExecutiveContentProps {
  data: ResumeData
}

export const ExecutiveContent = ({ data }: ExecutiveContentProps) => {
  return (
    <View style={executiveStyles.contentContainer}>
      <ExecutiveExperience experience={data.experience} />
      <ExecutiveEducation education={data.education} />
      <ExecutiveSkills skills={data.skills} />
      <ExecutiveProjects projects={data.projects} />
      <ExecutiveCertifications certifications={data.certifications} />
      <ExecutiveLanguages languages={data.languages} />
    </View>
  )
}