import { Text, View, Image } from '@react-pdf/renderer'
import { PersonalInfo } from '@/types/resume'
import { creativeArtisticStyles } from '../styles/creativeArtisticStyles'

interface CreativeArtisticHeaderProps {
  personal: PersonalInfo
}

export const CreativeArtisticHeader = ({ personal }: CreativeArtisticHeaderProps) => {
  const contactItems = [
    { label: 'Email', value: personal.email },
    { label: 'Phone', value: personal.phone },
    { label: 'Location', value: personal.location },
    { label: 'Website', value: personal.website }
  ].filter(item => item.value)

  return (
    <View style={creativeArtisticStyles.header}>
      <View style={creativeArtisticStyles.headerContent}>
        {/* Left side - Text content */}
        <View style={creativeArtisticStyles.headerLeft}>
          {/* Name */}
          <Text style={creativeArtisticStyles.name}>{personal.fullName}</Text>
          
          {/* Job Title */}
          {personal.title && (
            <Text style={creativeArtisticStyles.title}>{personal.title}</Text>
          )}
          
          {/* Contact Information Grid */}
          <View style={creativeArtisticStyles.contactGrid}>
            {contactItems.map((item, index) => (
              <View key={index} style={creativeArtisticStyles.contactItem}>
                <View style={creativeArtisticStyles.contactIcon} />
                <Text style={creativeArtisticStyles.contactText}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Optional Demographics - Compact */}
          {(personal.dateOfBirth || personal.gender || personal.nationality || personal.maritalStatus || personal.country) && (
            <View style={creativeArtisticStyles.demographicsCompact}>
              <View style={creativeArtisticStyles.demographicIcon} />
              <Text style={creativeArtisticStyles.demographicsText}>
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

        {/* Right side - Profile photo with decorative border */}
        {personal.profileImage && (
          <View style={creativeArtisticStyles.photoContainer}>
            <View style={creativeArtisticStyles.photoBorder} />
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image 
              src={personal.profileImage} 
              style={creativeArtisticStyles.profilePhoto}
              />
          </View>
        )}
      </View>
    </View>
  )
}