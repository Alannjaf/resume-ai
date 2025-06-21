import { Document, Page, View } from '@react-pdf/renderer'
import { ResumeData } from '@/types/resume'
import { CreativeArtisticHeader } from './components/CreativeArtisticHeader'
import { CreativeArtisticContent } from './components/CreativeArtisticContent'
import { creativeArtisticStyles } from './styles/creativeArtisticStyles'

interface CreativeArtisticTemplateProps {
  data: ResumeData
}

export const CreativeArtisticTemplate = ({ data }: CreativeArtisticTemplateProps) => {
  return (
    <Document>
      <Page size="A4" style={creativeArtisticStyles.page} wrap={true}>
        {/* Background gradient overlay - only on first page */}
        <View style={creativeArtisticStyles.backgroundOverlay} />
        
        {/* Decorative accent bar - only on first page */}
        <View style={creativeArtisticStyles.accentBar} />
        
        <CreativeArtisticHeader personal={data.personal} />
        <CreativeArtisticContent data={data} />
      </Page>
    </Document>
  )
}