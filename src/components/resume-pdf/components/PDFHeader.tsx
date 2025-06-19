import React from 'react'
import { View, Text, Image, Link } from '@react-pdf/renderer'
import { styles } from '../styles/pdfStyles'
import { PersonalInfo } from '../../../types/resume'

interface PDFHeaderProps {
  personal: PersonalInfo
}

export const PDFHeader: React.FC<PDFHeaderProps> = ({ personal }) => {
  return (
    <View style={styles.header}>
      <View style={styles.profileImageContainer}>
        {personal.profileImage ? (
          <Image 
            src={personal.profileImage} 
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Text style={{ fontSize: 14, color: '#64748b' }}>Photo</Text>
          </View>
        )}
      </View>
      <View style={styles.headerText}>
        <Text style={styles.name}>{personal.fullName}</Text>
        {personal.title && <Text style={styles.title}>{personal.title}</Text>}
        <View style={styles.contactInfo}>
          <Text style={styles.contactItem}>{personal.email}</Text>
          <Text style={styles.contactItem}>{personal.phone}</Text>
          <Text style={styles.contactItem}>{personal.location}</Text>
          {personal.linkedin && (
            <Link src={personal.linkedin} style={styles.contactItem}>
              LinkedIn Profile
            </Link>
          )}
          {personal.website && (
            <Link src={personal.website} style={styles.contactItem}>
              Portfolio
            </Link>
          )}
        </View>
      </View>
    </View>
  )
}