import { StyleSheet } from '@react-pdf/renderer'

const colors = {
  primary: '#1e40af',      // Corporate blue
  secondary: '#334155',    // Dark slate
  accent: '#3b82f6',       // Bright blue
  text: '#1e293b',         // Dark text
  light: '#f1f5f9',        // Light background
  white: '#ffffff',        // White
  border: '#cbd5e1',       // Light border
  gray: '#64748b',         // Medium gray
}

export const corporateStyles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 35,
    backgroundColor: colors.white,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },

  // Header Styles
  header: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottom: `3px solid ${colors.primary}`,
  },

  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  headerText: {
    flex: 1,
    paddingRight: 20,
  },

  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 6,
    letterSpacing: 0.5,
  },

  headerJobTitle: {
    fontSize: 13,
    color: colors.secondary,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  contactInfo: {
    marginTop: 4,
  },

  contactRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 3,
    gap: 12,
  },

  contactItem: {
    fontSize: 9,
    color: colors.gray,
  },

  // Photo Styles
  photoContainer: {
    width: 85,
    height: 85,
    marginTop: 5,
  },

  profilePhoto: {
    width: 85,
    height: 85,
    borderRadius: 6,
    border: `2px solid ${colors.border}`,
  },

  // Summary Section
  summarySection: {
    marginBottom: 22,
    paddingBottom: 12,
  },

  summaryText: {
    fontSize: 10,
    color: colors.text,
    textAlign: 'justify',
    lineHeight: 1.5,
  },

  // Content Container
  contentContainer: {
    flex: 1,
  },

  // Section Styles
  section: {
    marginBottom: 22,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    borderBottom: `2px solid ${colors.light}`,
    paddingBottom: 4,
  },

  // Experience Styles
  experienceItem: {
    marginBottom: 18,
    breakInside: 'avoid',
  },

  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },

  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },

  dateRange: {
    fontSize: 9,
    color: colors.gray,
    fontWeight: 'medium',
  },

  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  company: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: 'bold',
    flex: 1,
  },

  location: {
    fontSize: 9,
    color: colors.gray,
  },

  description: {
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.4,
    textAlign: 'justify',
  },

  // Education Styles
  educationItem: {
    marginBottom: 14,
    breakInside: 'avoid',
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
    color: colors.text,
    flex: 1,
  },

  school: {
    fontSize: 10,
    color: colors.accent,
    fontWeight: 'bold',
    marginBottom: 2,
  },

  field: {
    fontSize: 9,
    color: colors.gray,
    marginBottom: 2,
  },

  gpa: {
    fontSize: 9,
    color: colors.text,
    fontStyle: 'italic',
  },

  // Skills Styles
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  skillItem: {
    fontSize: 9,
    color: colors.text,
    marginRight: 10,
    lineHeight: 1.5,
  },

  // Languages Styles
  languagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },

  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
    marginBottom: 4,
  },

  languageName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 4,
  },

  languageLevel: {
    fontSize: 9,
    color: colors.gray,
    fontWeight: 'normal',
  },

  // Projects Styles
  projectItem: {
    marginBottom: 14,
    breakInside: 'avoid',
  },

  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 3,
  },

  projectDescription: {
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.4,
    marginBottom: 3,
  },

  projectTech: {
    fontSize: 9,
    color: colors.gray,
    fontStyle: 'italic',
  },

  // Certifications Styles
  certItem: {
    marginBottom: 10,
    breakInside: 'avoid',
  },

  certName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },

  certIssuer: {
    fontSize: 9,
    color: colors.accent,
  },
})

