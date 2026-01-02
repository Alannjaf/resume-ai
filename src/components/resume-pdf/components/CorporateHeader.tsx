import { Text, View, Image } from '@react-pdf/renderer'
import { PersonalInfo } from '@/types/resume'
import { corporateStyles } from '../styles/corporateStyles'

interface CorporateHeaderProps {
  personal: PersonalInfo
}

export const CorporateHeader = ({ personal }: CorporateHeaderProps) => {
  return (
    <View style={corporateStyles.header}>
      <View style={corporateStyles.headerContent}>
        {/* Left side - Text content */}
        <View style={corporateStyles.headerText}>
          {/* Name */}
          <Text style={corporateStyles.name}>{personal.fullName}</Text>
          
          {/* Job Title */}
          {personal.title && (
            <Text style={corporateStyles.headerJobTitle}>{personal.title}</Text>
          )}
          
          {/* Contact Information */}
          <View style={corporateStyles.contactInfo}>
            {personal.email && (
              <View style={corporateStyles.contactRow}>
                {personal.email && (
                  <Text style={corporateStyles.contactItem}>{personal.email}</Text>
                )}
                {personal.phone && (
                  <Text style={corporateStyles.contactItem}>| {personal.phone}</Text>
                )}
              </View>
            )}
            {(personal.location || personal.website) && (
              <View style={corporateStyles.contactRow}>
                {personal.location && (
                  <Text style={corporateStyles.contactItem}>{personal.location}</Text>
                )}
                {personal.website && (
                  <Text style={corporateStyles.contactItem}>| {personal.website}</Text>
                )}
              </View>
            )}
          </View>
        </View>

        {/* Right side - Profile photo (only if photo exists) */}
        {personal.profileImage && (
          <View style={corporateStyles.photoContainer}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image 
              src={personal.profileImage} 
              style={corporateStyles.profilePhoto}
            />
          </View>
        )}
      </View>
    </View>
  )
}

