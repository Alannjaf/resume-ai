import { Page, Text, View, Document } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { ExecutiveHeader } from './components/ExecutiveHeader'
import { ExecutiveContent } from './components/ExecutiveContent'
import { executiveStyles } from './styles/executiveStyles'

interface ExecutiveProfessionalTemplateProps {
  data: ResumeData
}

export const ExecutiveProfessionalTemplate = ({ data }: ExecutiveProfessionalTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={executiveStyles.page} wrap={true}>
        {/* Executive header with contact info */}
        <ExecutiveHeader personal={data.personal} />
        
        {/* Professional summary section */}
        {data.summary && (
          <View style={executiveStyles.summarySection} wrap={false}>
            <Text style={executiveStyles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={executiveStyles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Main content area */}
        <ExecutiveContent data={data} />
      </Page>
    </Document>
  )
}