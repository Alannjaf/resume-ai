import { StyleSheet } from '@react-pdf/renderer'

const colors = {
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Purple
  accent: '#ec4899',       // Pink
  text: '#1f2937',         // Dark text
  light: '#f3f4f6',        // Light background
  white: '#ffffff',        // White
  border: '#e5e7eb',       // Light border
  gray: '#6b7280',         // Medium gray
}

export const creativeModernStyles = StyleSheet.create({
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
    borderBottom: `4px solid ${colors.primary}`,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  headerJobTitle: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 2,
  },

  contactInfo: {
    marginTop: 4,
  },

  contactRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 3,
    gap: 10,
  },

  contactItem: {
    fontSize: 9,
    color: colors.gray,
  },

  // Photo Styles
  photoContainer: {
    width: 90,
    height: 90,
    marginTop: 5,
  },

  profilePhoto: {
    width: 90,
    height: 90,
    borderRadius: 12,
    border: `3px solid ${colors.secondary}`,
  },

  // Summary Section
  summarySection: {
    marginBottom: 22,
    paddingBottom: 12,
    paddingLeft: 15,
    borderLeft: `4px solid ${colors.accent}`,
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
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  sectionTitleAccent: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: '4 8',
    marginBottom: 10,
    borderRadius: 4,
  },

  // Experience Styles
  experienceItem: {
    marginBottom: 18,
    breakInside: 'avoid',
    paddingLeft: 12,
    borderLeft: `2px solid ${colors.light}`,
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
    color: colors.secondary,
    fontWeight: 'bold',
  },

  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  company: {
    fontSize: 10,
    color: colors.secondary,
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
    paddingLeft: 12,
    borderLeft: `2px solid ${colors.light}`,
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
    color: colors.secondary,
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
    gap: 6,
  },

  skillItem: {
    fontSize: 9,
    color: colors.text,
    backgroundColor: colors.light,
    padding: '3 8',
    borderRadius: 12,
    marginBottom: 4,
  },

  // Languages Styles
  languagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },

  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light,
    padding: '3 8',
    borderRadius: 12,
    marginRight: 6,
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
    paddingLeft: 12,
    borderLeft: `2px solid ${colors.light}`,
  },

  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.primary,
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
    paddingLeft: 12,
    borderLeft: `2px solid ${colors.light}`,
  },

  certName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },

  certIssuer: {
    fontSize: 9,
    color: colors.secondary,
    fontWeight: 'bold',
  },
})

