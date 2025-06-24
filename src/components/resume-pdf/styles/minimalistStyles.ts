import { StyleSheet } from '@react-pdf/renderer'

const colors = {
  primary: '#0f172a',      // Dark slate
  secondary: '#64748b',    // Slate gray
  accent: '#374151',       // Medium gray
  text: '#1f2937',         // Dark gray
  light: '#f8fafc',        // Very light slate
  white: '#ffffff',        // White
  border: '#d1d5db',       // Light border
}

export const minimalistStyles = StyleSheet.create({
  page: {
    paddingTop: 50,
    paddingBottom: 50,
    paddingHorizontal: 60, 
    backgroundColor: colors.white,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },

  // Header Styles
  header: {
    textAlign: 'center',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottom: `1px solid ${colors.border}`,
  },

  name: {
    fontSize: 32,
    fontWeight: 'normal',
    color: colors.primary,
    marginBottom: 16,
    letterSpacing: 1,
  },

  title: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 15,
    fontWeight: 'normal',
    letterSpacing: 0.5,
  },

  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },

  contactItem: {
    fontSize: 10,
    color: colors.text,
    marginHorizontal: 10,
  },

  contactSeparator: {
    fontSize: 10,
    color: colors.secondary,
    marginHorizontal: 2,
  },

  // Photo Styles
  photoContainer: {
    width: 90,
    height: 90,
    marginBottom: 20,
    alignSelf: 'center',
  },

  profilePhoto: {
    width: 90,
    height: 90,
    borderRadius: 45,
    border: `1px solid ${colors.border}`,
  },

  // Section Styles
  section: {
    marginBottom: 30,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 2,
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: 5,
  },

  // Summary Section
  summaryText: {
    fontSize: 11,
    color: colors.text,
    lineHeight: 1.6,
    textAlign: 'justify',
  },

  // Experience Styles
  experienceItem: {
    marginBottom: 20,
    breakInside: 'avoid',
    keepTogether: true,
  },

  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },

  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
    marginRight: 15,
  },

  dateRange: {
    fontSize: 9,
    color: colors.secondary,
    textAlign: 'right',
    minWidth: 80,
  },

  company: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: 'normal',
    marginBottom: 3,
  },

  location: {
    fontSize: 9,
    color: colors.secondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },

  description: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.5,
    textAlign: 'justify',
  },

  // Education Styles
  educationItem: {
    marginBottom: 16,
    breakInside: 'avoid',
    keepTogether: true,
  },

  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },

  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
    marginRight: 15,
  },

  school: {
    fontSize: 10,
    color: colors.accent,
    marginBottom: 3,
  },

  field: {
    fontSize: 9,
    color: colors.secondary,
    marginBottom: 3,
  },

  gpa: {
    fontSize: 9,
    color: colors.text,
    fontStyle: 'italic',
  },

  // Skills Styles
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 3,
  },

  skillText: {
    fontSize: 10,
    color: colors.text,
    marginRight: 12,
    marginBottom: 5,
  },

  skillSeparator: {
    fontSize: 10,
    color: colors.secondary,
    marginRight: 12,
    marginBottom: 5,
  },

  // Languages Styles
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },

  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },

  languageName: {
    fontSize: 10,
    color: colors.text,
    marginRight: 4,
  },

  languageLevel: {
    fontSize: 9,
    color: colors.secondary,
    fontStyle: 'italic',
  },

  languageSeparator: {
    fontSize: 10,
    color: colors.secondary,
    marginHorizontal: 8,
  },

  // Demographics Styles
  demographicsInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 8,
  },

  demographicItem: {
    fontSize: 9,
    color: colors.secondary,
  },
})