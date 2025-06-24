import React from 'react'
import { View, Text } from '@react-pdf/renderer'
import { styles } from '../styles/developerStyles'
import { PersonalInfo } from '../../../types/resume'

interface DeveloperHeaderProps {
  personal: PersonalInfo
}

export const DeveloperHeader: React.FC<DeveloperHeaderProps> = ({ personal }) => {
  return (
    <View wrap={false} style={styles.header}>
      {/* Name with curly braces like in terminal */}
      <View style={styles.nameContainer}>
        <Text style={styles.nameBrace}>{'{'}</Text>
        <Text style={styles.name}>{personal.fullName}</Text>
        <Text style={styles.nameBrace}>{'}'}</Text>
      </View>
      
      {/* Job title below name */}
      {personal.title && (
        <View style={styles.jobTitleContainer}>
          <Text style={styles.jobTitleText}>{personal.title}</Text>
        </View>
      )}
      
      {/* Contact information below job title */}
      <View style={styles.headerContactInfo}>
        <Text style={styles.headerContactItem}>{personal.email}</Text>
        <Text style={styles.headerContactItem}>{personal.phone}</Text>
        {personal.location && (
          <Text style={styles.headerContactItem}>{personal.location}</Text>
        )}
        {personal.linkedin && (
          <Text style={styles.headerContactItem}>{personal.linkedin}</Text>
        )}
        {personal.website && (
          <Text style={styles.headerContactItem}>{personal.website}</Text>
        )}
      </View>
    </View>
  )
}