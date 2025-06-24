import { StyleSheet } from '@react-pdf/renderer'

export const executiveStyles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 35,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },

  // Header Styles
  header: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottom: '2px solid #2563eb',
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    letterSpacing: 1,
  },

  headerJobTitle: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: 'medium',
    marginBottom: 12,
  },

  contactInfo: {
    marginTop: 8,
  },

  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  contactItem: {
    fontSize: 10,
    color: '#6b7280',
    flex: 1,
    textAlign: 'left',
  },

  // Photo Styles
  photoContainer: {
    width: 80,
    height: 80,
    marginTop: 5,
  },

  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    border: '2px solid #e5e7eb',
  },

  // Summary Section
  summarySection: {
    marginBottom: 25,
    paddingBottom: 15,
  },

  summaryText: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'justify',
    lineHeight: 1.5,
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
    color: '#1e293b',
    marginBottom: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: 5,
  },

  // Experience Styles
  experienceItem: {
    marginBottom: 20,
  },

  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },

  dateRange: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: 'medium',
  },

  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  company: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: 'medium',
    flex: 1,
  },

  location: {
    fontSize: 10,
    color: '#6b7280',
  },

  description: {
    fontSize: 10,
    color: '#374151',
    lineHeight: 1.4,
    textAlign: 'justify',
  },

  // Education Styles
  educationItem: {
    marginBottom: 16,
  },

  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },

  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },

  school: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: 'medium',
    marginBottom: 2,
  },

  field: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 2,
  },

  gpa: {
    fontSize: 10,
    color: '#374151',
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
    color: '#374151',
    marginRight: 8,
    lineHeight: 1.3,
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
    marginRight: 16,
    marginBottom: 4,
  },

  languageName: {
    fontSize: 10,
    fontWeight: 'medium',
    color: '#1e293b',
    marginRight: 4,
  },

  languageLevel: {
    fontSize: 9,
    color: '#6b7280',
    fontWeight: 'normal',
  },

  // Demographics Styles - Compact Layout
  demographicsCompact: {
    marginTop: 4,
  },

  demographicsText: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 1.3,
  },
})