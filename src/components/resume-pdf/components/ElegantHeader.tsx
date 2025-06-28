import { Text, View, Image } from '@react-pdf/renderer'
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
      {/* Profile photo at the top if exists */}
      {personal.profileImage && (
        <View style={elegantStyles.photoContainer}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image 
            src={personal.profileImage} 
            style={elegantStyles.profilePhoto}
          />
        </View>
      )}
      
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

      {/* Optional Demographics */}
      {(personal.dateOfBirth || personal.gender || personal.nationality || personal.maritalStatus || personal.country) && (
        <View style={elegantStyles.demographicsInfo}>
          {[
            personal.dateOfBirth && `Born: ${personal.dateOfBirth}`,
            personal.gender && `Gender: ${personal.gender}`,
            personal.nationality && `Nationality: ${personal.nationality}`,
            personal.maritalStatus && `Marital Status: ${personal.maritalStatus}`,
            personal.country && `Country: ${personal.country}`
          ].filter(Boolean).map((item, index, array) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={elegantStyles.demographicItem}>{item}</Text>
              {index < array.length - 1 && (
                <Text style={elegantStyles.contactSeparator}>•</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}