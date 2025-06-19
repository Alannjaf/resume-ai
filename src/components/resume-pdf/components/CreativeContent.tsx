import React from 'react'
import { View } from '@react-pdf/renderer'
import { sectionStyles } from '../styles/creativeSectionStyles'
import { CreativeSidebar } from './CreativeSidebar'
import { CreativeMainSection } from './CreativeMainSection'
import { ResumeData } from '../../../types/resume'

interface CreativeContentProps {
  data: ResumeData
}

export const CreativeContent: React.FC<CreativeContentProps> = ({ data }) => {
  return (
    <View style={sectionStyles.mainContent}>
      {/* Left sidebar with skills, education, etc. */}
      <View style={sectionStyles.leftSide}>
        <CreativeSidebar data={data} />
      </View>

      {/* Right main content with experience and projects */}
      <View style={sectionStyles.rightSide}>
        <CreativeMainSection data={data} />
      </View>
    </View>
  )
}