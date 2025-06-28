import { Text, View, Image } from '@react-pdf/renderer'
import { PersonalInfo } from '@/types/resume'
import { executiveStyles } from '../styles/executiveStyles'

interface ExecutiveHeaderProps {
  personal: PersonalInfo
}

export const ExecutiveHeader = ({ personal }: ExecutiveHeaderProps) => {
  return (
    <View style={executiveStyles.header}>
      <View style={executiveStyles.headerContent}>
        {/* Left side - Text content */}
        <View style={executiveStyles.headerText}>
          {/* Name */}
          <Text style={executiveStyles.name}>{personal.fullName}</Text>
          
          {/* Job Title */}
          {personal.title && (
            <Text style={executiveStyles.headerJobTitle}>{personal.title}</Text>
          )}
          
          {/* Contact Information */}
          <View style={executiveStyles.contactInfo}>
            <View style={executiveStyles.contactRow}>
              {personal.email && (
                <Text style={executiveStyles.contactItem}>{personal.email}</Text>
              )}
              {personal.phone && (
                <Text style={executiveStyles.contactItem}>{personal.phone}</Text>
              )}
            </View>
            <View style={executiveStyles.contactRow}>
              {personal.location && (
                <Text style={executiveStyles.contactItem}>{personal.location}</Text>
              )}
              {personal.website && (
                <Text style={executiveStyles.contactItem}>{personal.website}</Text>
              )}
            </View>
          </View>

          {/* Optional Demographics - Compact Layout */}
          {(personal.dateOfBirth || personal.gender || personal.nationality || personal.maritalStatus || personal.country) && (
            <View style={executiveStyles.demographicsCompact}>
              <Text style={executiveStyles.demographicsText}>
                {[
                  personal.dateOfBirth && `Born: ${personal.dateOfBirth}`,
                  personal.gender && `Gender: ${personal.gender}`,
                  personal.nationality && `Nationality: ${personal.nationality}`,
                  personal.maritalStatus && `Marital: ${personal.maritalStatus}`,
                  personal.country && `Country: ${personal.country}`
                ].filter(Boolean).join(' • ')}
              </Text>
            </View>
          )}
        </View>

        {/* Right side - Profile photo (only if photo exists) */}
        {personal.profileImage && (
          <View style={executiveStyles.photoContainer}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image 
              src={personal.profileImage} 
              style={executiveStyles.profilePhoto}
            />
          </View>
        )}
      </View>
    </View>
  )
}