import { Text, View } from '@react-pdf/renderer'
import { PersonalInfo } from '@/types/resume'
import { elegantStyles } from '../styles/elegantStyles'

interface ElegantHeaderProps {
  personal: PersonalInfo
}

export const ElegantHeader = ({ personal }: ElegantHeaderProps) => {
  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website
  ].filter(Boolean)

  return (
    <View style={elegantStyles.header}>
      {/* Full Name */}
      <Text style={elegantStyles.name}>{personal.fullName}</Text>
      
      {/* Job Title */}
      {personal.title && (
        <Text style={elegantStyles.title}>{personal.title}</Text>
      )}
      
      {/* Contact Information */}
      {contactItems.length > 0 && (
        <View style={elegantStyles.contactInfo}>
          {contactItems.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={elegantStyles.contactItem}>{item}</Text>
              {index < contactItems.length - 1 && (
                <Text style={elegantStyles.contactSeparator}>•</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}