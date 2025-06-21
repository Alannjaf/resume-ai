import { Document, Page } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { MinimalistHeader } from './components/MinimalistHeader'
import { MinimalistContent } from './components/MinimalistContent'
import { minimalistStyles } from './styles/minimalistStyles'

interface MinimalistModernTemplateProps {
  data: ResumeData
}

export const MinimalistModernTemplate = ({ data }: MinimalistModernTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={minimalistStyles.page} wrap={true}>
        <MinimalistHeader personal={data.personal} />
        <MinimalistContent data={data} />
      </Page>
    </Document>
  )
}