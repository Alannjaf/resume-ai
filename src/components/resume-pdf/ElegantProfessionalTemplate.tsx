import { Page, Document } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { ElegantHeader } from './components/ElegantHeader'
import { ElegantContent } from './components/ElegantContent'
import { elegantStyles } from './styles/elegantStyles'

interface ElegantProfessionalTemplateProps {
  data: ResumeData
}

export const ElegantProfessionalTemplate = ({ data }: ElegantProfessionalTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={elegantStyles.page} wrap={true}>
        {/* Elegant header with contact info */}
        <ElegantHeader personal={data.personal} />
        
        {/* Main content area */}
        <ElegantContent data={data} />
      </Page>
    </Document>
  )
}