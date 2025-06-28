import { Text, View, Image } from '@react-pdf/renderer'
import { PersonalInfo } from '@/types/resume'
import { minimalistStyles } from '../styles/minimalistStyles'

interface MinimalistHeaderProps {
  personal: PersonalInfo
}

export const MinimalistHeader = ({ personal }: MinimalistHeaderProps) => {
  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.website
  ].filter(Boolean)

  return (
    <View style={minimalistStyles.header}>
      {/* Profile photo at the top if exists */}
      {personal.profileImage && (
        <View style={minimalistStyles.photoContainer}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image 
            src={personal.profileImage} 
            style={minimalistStyles.profilePhoto}
          />
        </View>
      )}
      
      {/* Full Name */}
      <Text style={minimalistStyles.name}>{personal.fullName}</Text>
      
      {/* Job Title */}
      {personal.title && (
        <Text style={minimalistStyles.title}>{personal.title}</Text>
      )}
      
      {/* Contact Information */}
      {contactItems.length > 0 && (
        <View style={minimalistStyles.contactInfo}>
          {contactItems.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={minimalistStyles.contactItem}>{item}</Text>
              {index < contactItems.length - 1 && (
                <Text style={minimalistStyles.contactSeparator}>|</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Optional Demographics */}
      {(personal.dateOfBirth || personal.gender || personal.nationality || personal.maritalStatus || personal.country) && (
        <View style={minimalistStyles.demographicsInfo}>
          {[
            personal.dateOfBirth && `Born: ${personal.dateOfBirth}`,
            personal.gender && `Gender: ${personal.gender}`,
            personal.nationality && `Nationality: ${personal.nationality}`,
            personal.maritalStatus && `Marital Status: ${personal.maritalStatus}`,
            personal.country && `Country: ${personal.country}`
          ].filter(Boolean).map((item, index, array) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={minimalistStyles.demographicItem}>{item}</Text>
              {index < array.length - 1 && (
                <Text style={minimalistStyles.contactSeparator}>|</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  )
}