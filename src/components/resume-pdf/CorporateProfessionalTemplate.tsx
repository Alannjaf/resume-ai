import { Page, Text, View, Document } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { CorporateHeader } from './components/CorporateHeader'
import { CorporateContent } from './components/CorporateContent'
import { corporateStyles } from './styles/corporateStyles'

interface CorporateProfessionalTemplateProps {
  data: ResumeData
}

export const CorporateProfessionalTemplate = ({ data }: CorporateProfessionalTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={corporateStyles.page} wrap={true}>
        {/* Corporate header with contact info */}
        <CorporateHeader personal={data.personal} />
        
        {/* Professional summary section */}
        {data.summary && (
          <View style={corporateStyles.summarySection} wrap={false}>
            <Text style={corporateStyles.sectionTitle}>PROFESSIONAL SUMMARY</Text>
            <Text style={corporateStyles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* Main content area */}
        <CorporateContent data={data} />
      </Page>
    </Document>
  )
}

