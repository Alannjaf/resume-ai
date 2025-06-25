import { StyleSheet } from '@react-pdf/renderer'

const colors = {
  primary: '#9333ea',       // Purple
  secondary: '#ec4899',     // Pink
  accent: '#f59e0b',        // Amber
  text: '#1f2937',          // Dark gray
  lightText: '#6b7280',     // Medium gray
  background: '#fefefe',    // Near white
  white: '#ffffff',         // White
  gradient: '#f3e8ff',      // Light purple
  border: '#e5e7eb',        // Light border
}

export const creativeArtisticStyles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: colors.background,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.4,
  },

  // Background Elements - Only on first page
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: -35,
    right: -35,
    height: 220,
    backgroundColor: colors.gradient,
  },

  accentBar: {
    position: 'absolute',
    top: 0,
    left: -35,
    width: 8,
    height: 220,
    backgroundColor: colors.primary,
  },

  // Header Styles
  header: {
    paddingTop: 18,
    paddingBottom: 22,
    paddingHorizontal: 15,
    marginBottom: 16,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flex: 1,
    paddingRight: 30,
  },

  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    lineHeight: 1.2,
  },

  title: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 12,
    fontWeight: 'medium',
    letterSpacing: 0.8,
  },

  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6, // Reduced from 12 to 6
    marginBottom: 6, // Reduced from 8 to 6
  },

  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2, // Further reduced from 4 to 2
    minWidth: '45%',
  },

  contactIcon: {
    width: 12,
    height: 12,
    backgroundColor: colors.accent,
    borderRadius: 6,
    marginRight: 8,
  },

  contactText: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'medium',
  },

  // Photo Styles
  photoContainer: {
    width: 120,
    height: 120,
    alignSelf: 'flex-end',
    position: 'relative',
    marginTop: -50, // Center vertically with background shape
  },

  photoBorder: {
    position: 'absolute',
    top: -5,
    left: -5,
    right: -5,
    bottom: -5,
    borderRadius: 65,
    backgroundColor: colors.secondary,
  },

  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    border: `3px solid ${colors.white}`,
  },

  // Content Styles
  content: {
    paddingHorizontal: 15,
  },

  // Section Styles
  section: {
    marginBottom: 30,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionIcon: {
    width: 20,
    height: 20,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginRight: 15,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },

  sectionDivider: {
    height: 2,
    backgroundColor: colors.gradient,
    marginTop: 8,
    marginBottom: 15,
  },

  // Summary Section
  summaryCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    borderLeft: `4px solid ${colors.secondary}`,
    marginBottom: 5,
  },

  summaryText: {
    fontSize: 11,
    color: colors.text,
    lineHeight: 1.6,
    textAlign: 'justify',
    fontStyle: 'italic',
  },

  // Experience Styles
  experienceItem: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    marginBottom: 15,
    borderLeft: `4px solid ${colors.accent}`,
    breakInside: 'avoid',
    keepTogether: true,
  },

  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  jobTitleContainer: {
    flex: 1,
    paddingRight: 15,
  },

  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 3,
  },

  company: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: 'medium',
  },

  dateContainer: {
    alignItems: 'flex-end',
  },

  dateRange: {
    fontSize: 9,
    color: colors.lightText,
    fontWeight: 'medium',
    backgroundColor: colors.gradient,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },

  location: {
    fontSize: 9,
    color: colors.lightText,
    fontStyle: 'italic',
    marginTop: 2,
  },

  description: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginTop: 10,
  },

  // Education Styles
  educationItem: {
    backgroundColor: colors.white,
    padding: 18,
    borderRadius: 8,
    marginBottom: 12,
    borderLeft: `4px solid ${colors.primary}`,
    breakInside: 'avoid',
    keepTogether: true,
  },

  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },

  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
    marginRight: 15,
  },

  school: {
    fontSize: 11,
    color: colors.secondary,
    marginBottom: 3,
  },

  field: {
    fontSize: 10,
    color: colors.lightText,
    marginBottom: 3,
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
    gap: 8,
  },

  skillChip: {
    backgroundColor: colors.gradient,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
    border: `1px solid ${colors.primary}`,
  },

  skillText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: 'medium',
  },

  // Languages Styles
  languagesContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 8,
    borderLeft: `4px solid ${colors.secondary}`,
  },

  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gradient,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 8,
    minWidth: '40%',
  },

  languageDot: {
    width: 8,
    height: 8,
    backgroundColor: colors.secondary,
    borderRadius: 4,
    marginRight: 8,
  },

  languageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text,
    marginRight: 4,
  },

  languageLevel: {
    fontSize: 9,
    color: colors.lightText,
    fontStyle: 'italic',
  },

  // Demographics Styles - Compact Layout
  demographicsCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -2, // Move up from the edge
    paddingLeft: 2,
  },

  demographicIcon: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginRight: 6,
    marginTop: 1,
  },

  demographicsText: {
    fontSize: 10,
    color: colors.lightText,
    fontStyle: 'italic',
    lineHeight: 1.2,
    flex: 1,
  },
})