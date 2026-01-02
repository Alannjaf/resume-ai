import { Text, View, Image } from '@react-pdf/renderer'
import { PersonalInfo } from '@/types/resume'
import { classicStyles } from '../styles/classicStyles'

interface ClassicHeaderProps {
  personal: PersonalInfo
}

export const ClassicHeader = ({ personal }: ClassicHeaderProps) => {
  return (
    <View style={classicStyles.header}>
      {/* Profile photo (centered, only if photo exists) */}
      {personal.profileImage && (
        <View style={classicStyles.photoContainer}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image 
            src={personal.profileImage} 
            style={classicStyles.profilePhoto}
          />
        </View>
      )}

      {/* Name */}
      <Text style={classicStyles.name}>{personal.fullName}</Text>
      
      {/* Job Title */}
      {personal.title && (
        <Text style={classicStyles.headerJobTitle}>{personal.title}</Text>
      )}
      
      {/* Contact Information */}
      <View style={classicStyles.contactInfo}>
        {personal.email && (
          <View style={classicStyles.contactRow}>
            <Text style={classicStyles.contactItem}>{personal.email}</Text>
            {personal.phone && (
              <>
                <Text style={classicStyles.contactSeparator}>|</Text>
                <Text style={classicStyles.contactItem}>{personal.phone}</Text>
              </>
            )}
          </View>
        )}
        {(personal.location || personal.website) && (
          <View style={classicStyles.contactRow}>
            {personal.location && (
              <>
                <Text style={classicStyles.contactItem}>{personal.location}</Text>
                {personal.website && (
                  <>
                    <Text style={classicStyles.contactSeparator}>|</Text>
                    <Text style={classicStyles.contactItem}>{personal.website}</Text>
                  </>
                )}
              </>
            )}
            {!personal.location && personal.website && (
              <Text style={classicStyles.contactItem}>{personal.website}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  )
}

