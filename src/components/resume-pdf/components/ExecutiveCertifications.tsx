import { Text, View } from '@react-pdf/renderer'
import { Certification } from '@/types/resume'
import { executiveStyles } from '../styles/executiveStyles'
import { formatDate } from '../utils/dateUtils'

interface ExecutiveCertificationsProps {
  certifications: Certification[]
}

export const ExecutiveCertifications = ({ certifications }: ExecutiveCertificationsProps) => {
  if (!certifications || certifications.length === 0) return null

  return (
    <View style={executiveStyles.section}>
      {certifications.map((cert, index) => (
        <View key={cert.id} style={executiveStyles.educationItem} wrap={false}>
          {index === 0 && (
            <Text style={executiveStyles.sectionTitle}>CERTIFICATIONS</Text>
          )}
          <View style={executiveStyles.educationHeader} wrap={false}>
            <Text style={executiveStyles.degree}>{cert.name}</Text>
            {cert.date && (
              <Text style={executiveStyles.dateRange}>
                {formatDate(cert.date)}
              </Text>
            )}
          </View>
          <Text style={executiveStyles.school}>{cert.issuer}</Text>
          {cert.credentialId && <Text style={executiveStyles.field}>ID: {cert.credentialId}</Text>}
          {cert.url && <Text style={executiveStyles.location}>{cert.url}</Text>}
        </View>
      ))}
    </View>
  )
}