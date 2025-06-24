import { StyleSheet } from '@react-pdf/renderer'

// Developer code-style color palette with white background
const colors = {
  background: '#ffffff',     // White background
  surface: '#f8fafc',       // Light surface
  primary: '#0284c7',       // Blue for highlights
  secondary: '#059669',     // Green for strings/success
  accent: '#d97706',        // Orange for keywords
  purple: '#7c3aed',        // Purple for functions
  red: '#dc2626',           // Red for errors/important
  text: '#000000',          // Pure black text
  gray: '#4b5563',          // Darker gray
  lightGray: '#374151',     // Darker gray for better contrast
  border: '#e5e7eb',        // Border color
}

export const styles = StyleSheet.create({
  // Page setup
  page: {
    fontFamily: 'Courier',
    fontSize: 11,
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 35,
    backgroundColor: colors.background,
    color: colors.text,
    lineHeight: 1.4,
  },

  // Background elements - none needed for clean terminal look
  codeBackground: {
    display: 'none',
  },

  accentBorder: {
    display: 'none',
  },

  terminalWindow: {
    display: 'none',
  },

  // Layout - single column terminal style
  container: {
    flex: 1,
  },

  // Header styles - terminal style with brackets
  header: {
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  
  profileImageContainer: {
    width: 60,
    height: 60,
    marginRight: 15,
    marginTop: 5,
  },
  
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    border: `2px solid ${colors.secondary}`,
  },
  
  headerTextContainer: {
    flex: 1,
  },

  // Name with curly braces like in image
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  nameBrace: {
    fontSize: 32,
    color: colors.text,
    fontWeight: 'bold',
  },

  name: {
    fontSize: 32,
    color: colors.text,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },

  // Job title below name
  jobTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  jobTitleText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },

  // Contact info in header
  headerContactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    gap: 15,
  },

  headerContactItem: {
    fontSize: 11,
    color: colors.gray,
  },

  // Contact info at bottom (to be removed)
  contactInfo: {
    display: 'none',
  },

  contactItem: {
    display: 'none',
  },

  // Section styles - code syntax highlighting
  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 14,
    color: colors.accent,
    marginBottom: 8,
    fontWeight: 'bold',
  },

  // Comment style for section descriptions
  commentLine: {
    fontSize: 11,
    color: colors.lightGray,
    marginBottom: 4,
    fontStyle: 'italic',
  },

  // Summary with comment syntax
  summary: {
    fontSize: 11,
    lineHeight: 1.5,
    color: colors.lightGray,
    marginBottom: 12,
  },

  // Experience - code syntax style with grouping
  experienceItem: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: `1px solid ${colors.border}`,
  },

  jobTitle: {
    fontSize: 12,
    color: colors.secondary,
    marginBottom: 3,
    fontWeight: 'bold',
  },

  company: {
    fontSize: 11,
    color: colors.primary,
    marginBottom: 3,
  },

  dateRange: {
    fontSize: 10,
    color: colors.lightGray,
    marginBottom: 6,
  },

  description: {
    fontSize: 10,
    lineHeight: 1.4,
    color: colors.lightGray,
    marginBottom: 8,
  },

  // Education - code syntax style
  educationItem: {
    marginBottom: 12,
  },

  degree: {
    fontSize: 11,
    color: colors.secondary,
    marginBottom: 3,
    fontWeight: 'bold',
  },

  school: {
    fontSize: 11,
    color: colors.primary,
    marginBottom: 3,
  },

  educationDetails: {
    fontSize: 10,
    color: colors.lightGray,
  },

  // Skills - code syntax highlighting
  skillItem: {
    fontSize: 10,
    color: colors.purple,
    marginBottom: 3,
  },

  skillLevel: {
    fontSize: 10,
    color: colors.lightGray,
    marginLeft: 4,
  },

  // Projects - code syntax style
  projectItem: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: `1px solid ${colors.border}`,
  },

  projectName: {
    fontSize: 11,
    color: colors.secondary,
    marginBottom: 3,
    fontWeight: 'bold',
  },

  projectTech: {
    fontSize: 10,
    color: colors.accent,
    marginBottom: 4,
  },

  projectDescription: {
    fontSize: 10,
    lineHeight: 1.4,
    color: colors.lightGray,
    marginBottom: 4,
  },

  projectLink: {
    fontSize: 10,
    color: colors.primary,
  },

  // Languages - code syntax style
  languageItem: {
    fontSize: 10,
    color: colors.purple,
    marginBottom: 3,
  },

  languageName: {
    fontSize: 10,
    color: colors.purple,
  },

  languageLevel: {
    fontSize: 10,
    color: colors.lightGray,
    marginLeft: 4,
  },

  // Certifications - code syntax style
  certificationItem: {
    marginBottom: 10,
  },

  certificationName: {
    fontSize: 10,
    color: colors.secondary,
    marginBottom: 3,
    fontWeight: 'bold',
  },

  certificationIssuer: {
    fontSize: 10,
    color: colors.primary,
    marginBottom: 3,
  },

  certificationDate: {
    fontSize: 10,
    color: colors.lightGray,
  },

  // Code syntax elements
  codeKeyword: {
    color: colors.accent,
  },

  codeString: {
    color: colors.secondary,
  },

  codeComment: {
    color: colors.lightGray,
    fontStyle: 'italic',
  },

  codeFunction: {
    color: colors.purple,
  },

  codeVariable: {
    color: colors.primary,
  },

  // Demographics Styles - Compact Code Comment
  demographicsCompact: {
    marginTop: 6,
  },

  demographicsText: {
    fontSize: 8,
    color: colors.green,
    fontFamily: 'Courier',
    lineHeight: 1.2,
  },
})