import React from 'react'
import { Document, Page, View } from '@react-pdf/renderer'
import { ResumeData } from '../../types/resume'
import { styles } from './styles/pdfStyles'
import { PDFHeader } from './components/PDFHeader'
import { LeftColumn } from './components/LeftColumn'
import { RightColumn } from './components/RightColumn'

interface EnhancedModernTemplateProps {
  data: ResumeData
}

const EnhancedModernTemplate: React.FC<EnhancedModernTemplateProps> = ({ data }) => {
  return (
    <Document>
      <Page 
        size="A4" 
        style={styles.page}
        wrap={true} // Enable automatic pagination
      >
        {/* Header Section - Only on first page */}
        <PDFHeader personal={data.personal} />

        {/* Body Section */}
        <View style={styles.body}>
          <LeftColumn data={data} />
          <RightColumn data={data} experiences={data.experience || []} />
        </View>
      </Page>
    </Document>
  )
}

export default EnhancedModernTemplate