import { Text, View, Image } from '@react-pdf/renderer'
import { PersonalInfo } from '@/types/resume'
import { creativeModernStyles } from '../styles/creativeModernStyles'

interface CreativeModernHeaderProps {
  personal: PersonalInfo
}

export const CreativeModernHeader = ({ personal }: CreativeModernHeaderProps) => {
  return (
    <View style={creativeModernStyles.header}>
      <View style={creativeModernStyles.headerContent}>
        {/* Left side - Text content */}
        <View style={creativeModernStyles.headerText}>
          {/* Name */}
          <Text style={creativeModernStyles.name}>{personal.fullName}</Text>
          
          {/* Job Title */}
          {personal.title && (
            <Text style={creativeModernStyles.headerJobTitle}>{personal.title}</Text>
          )}
          
          {/* Contact Information */}
          <View style={creativeModernStyles.contactInfo}>
            {personal.email && (
              <View style={creativeModernStyles.contactRow}>
                {personal.email && (
                  <Text style={creativeModernStyles.contactItem}>{personal.email}</Text>
                )}
                {personal.phone && (
                  <Text style={creativeModernStyles.contactItem}>• {personal.phone}</Text>
                )}
              </View>
            )}
            {(personal.location || personal.website) && (
              <View style={creativeModernStyles.contactRow}>
                {personal.location && (
                  <Text style={creativeModernStyles.contactItem}>{personal.location}</Text>
                )}
                {personal.website && (
                  <Text style={creativeModernStyles.contactItem}>• {personal.website}</Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Right side - Profile photo (only if photo exists) */}
        {personal.profileImage && (
          <View style={creativeModernStyles.photoContainer}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image 
              src={personal.profileImage} 
              style={creativeModernStyles.profilePhoto}
            />
          </View>
        )}
      </View>
    </View>
  )
}

