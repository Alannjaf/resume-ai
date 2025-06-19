import React from 'react'
import { View, Text, Image, Link } from '@react-pdf/renderer'
import { styles } from '../styles/creativeStyles'
import { PersonalInfo } from '../../../types/resume'

interface CreativeHeaderProps {
  personal: PersonalInfo
}

export const CreativeHeader: React.FC<CreativeHeaderProps> = ({ personal }) => {
  return (
    <View style={styles.header}>
      <View style={styles.profileContainer}>
        {/* Profile Image with Creative Border - Only show if photo exists */}
        {personal.profileImage && (
          <View style={styles.profileImageWrapper}>
            <View style={styles.profileImageBorder}>
              <Image 
                src={personal.profileImage} 
                style={styles.profileImage}
              />
            </View>
          </View>
        )}

        {/* Name and Title Section */}
        <View style={styles.nameSection}>
          <Text style={styles.name}>{personal.fullName}</Text>
          {personal.title && (
            <Text style={styles.title}>{personal.title}</Text>
          )}
        </View>
      </View>

      {/* Contact Information Grid */}
      <View style={styles.contactGrid}>
        <Text style={styles.contactItem}>{personal.email}</Text>
        <Text style={styles.contactItem}>{personal.phone}</Text>
        <Text style={styles.contactItem}>{personal.location}</Text>
        {personal.linkedin && (
          <Link src={personal.linkedin} style={styles.contactItem}>
            LinkedIn
          </Link>
        )}
        {personal.website && (
          <Link src={personal.website} style={styles.contactItem}>
            Portfolio
          </Link>
        )}
      </View>
    </View>
  )
}