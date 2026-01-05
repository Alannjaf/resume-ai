import { StyleSheet } from '@react-pdf/renderer'

const colors = {
  primary: '#1f2937',      // Dark gray/black
  secondary: '#4b5563',    // Medium gray
  accent: '#6b7280',       // Light gray
  text: '#111827',         // Very dark text
  light: '#f9fafb',        // Very light background
  white: '#ffffff',        // White
  border: '#d1d5db',       // Light border
  gray: '#6b7280',         // Medium gray
}

export const classicStyles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 50,
    backgroundColor: colors.white,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.5,
  },

  // Header Styles
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: `1px solid ${colors.border}`,
    textAlign: 'center',
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },

  headerJobTitle: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: 'normal',
    marginBottom: 12,
    fontStyle: 'italic',
  },

  contactInfo: {
    marginTop: 8,
  },

  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },

  contactItem: {
    fontSize: 9,
    color: colors.text,
  },

  contactSeparator: {
    fontSize: 9,
    color: colors.border,
  },

  // Photo Styles
  photoContainer: {
    width: 100,
    height: 100,
    marginBottom: 15,
    alignSelf: 'center',
  },

  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: `2px solid ${colors.border}`,
  },

  // Summary Section
  summarySection: {
    marginBottom: 25,
    paddingBottom: 15,
    borderBottom: `1px solid ${colors.light}`,
  },

  summaryText: {
    fontSize: 10,
    color: colors.text,
    textAlign: 'justify',
    lineHeight: 1.6,
  },

  // Content Container
  contentContainer: {
    flex: 1,
  },

  // Section Styles
  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: 4,
  },

  // Experience Styles
  experienceItem: {
    marginBottom: 20,
    breakInside: 'avoid',
  },

  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },

  jobTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },

  dateRange: {
    fontSize: 10,
    color: colors.secondary,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },

  companyInfo: {
    marginBottom: 6,
  },

  company: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'normal',
    marginBottom: 2,
  },

  location: {
    fontSize: 9,
    color: colors.gray,
    fontStyle: 'italic',
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
  },

  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },

  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },

  school: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'normal',
    marginBottom: 2,
  },

  field: {
    fontSize: 10,
    color: colors.secondary,
    marginBottom: 2,
    fontStyle: 'italic',
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
    fontSize: 10,
    color: colors.text,
    marginRight: 12,
    lineHeight: 1.6,
  },

  // Languages Styles
  languagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
  },

  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },

  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 4,
  },

  languageLevel: {
    fontSize: 9,
    color: colors.secondary,
    fontWeight: 'normal',
    fontStyle: 'italic',
  },

  // Projects Styles
  projectItem: {
    marginBottom: 16,
    breakInside: 'avoid',
  },

  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },

  projectDescription: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.5,
    marginBottom: 3,
  },

  projectTech: {
    fontSize: 9,
    color: colors.gray,
    fontStyle: 'italic',
  },

  // Certifications Styles
  certItem: {
    marginBottom: 12,
    breakInside: 'avoid',
  },

  certName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 2,
  },

  certIssuer: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'normal',
  },
})

