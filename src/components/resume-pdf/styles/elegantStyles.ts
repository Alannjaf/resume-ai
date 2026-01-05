import { StyleSheet } from '@react-pdf/renderer'

const colors = {
  primary: '#1e3a8a',      // Navy blue
  secondary: '#64748b',    // Slate gray
  accent: '#f1f5f9',      // Light slate
  text: '#0f172a',        // Dark slate
  light: '#f8fafc',       // Very light slate
  white: '#ffffff',       // White
  border: '#e2e8f0',      // Light border
}

export const elegantStyles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 45,
    backgroundColor: colors.white,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
    fontSize: 10},

  // Header Styles
  header: {
    marginBottom: 30,
    paddingBottom: 25,
    borderBottom: `1px solid ${colors.border}`,
    textAlign: 'center'},

  name: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 12,
    letterSpacing: 0.5},

  title: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: 'medium',
    marginBottom: 15,
    letterSpacing: 0.3},

  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8},

  contactItem: {
    fontSize: 10,
    color: colors.text,
    marginHorizontal: 8},

  contactSeparator: {
    fontSize: 10,
    color: colors.secondary,
    marginHorizontal: 4},

  // Photo Styles
  photoContainer: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: 'center'},

  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    border: `2px solid ${colors.primary}`},

  // Summary Section
  summarySection: {
    marginBottom: 25,
    backgroundColor: colors.accent,
    padding: 20,
    borderRadius: 4},

  summaryText: {
    fontSize: 11,
    color: colors.text,
    textAlign: 'justify',
    lineHeight: 1.6,
    fontStyle: 'italic'},

  // Section Styles
  section: {
    marginBottom: 25},

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
    position: 'relative'},

  sectionTitleWithLine: {
    borderBottom: `2px solid ${colors.primary}`,
    paddingBottom: 8,
    marginBottom: 20},

  // Experience Styles
  experienceItem: {
    marginBottom: 20,
    breakInside: 'avoid',
    keepTogether: true},

  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6},

  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 10},

  dateRange: {
    fontSize: 10,
    color: colors.secondary,
    fontWeight: 'medium',
    textAlign: 'right'},

  companyInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10},

  company: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'medium',
    flex: 1},

  location: {
    fontSize: 10,
    color: colors.secondary,
    fontStyle: 'italic'},

  description: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.5,
    textAlign: 'justify',
    marginTop: 5},

  // Education Styles
  educationItem: {
    marginBottom: 18,
    breakInside: 'avoid',
    keepTogether: true},

  educationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5},

  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 10},

  school: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: 'medium',
    marginBottom: 3},

  field: {
    fontSize: 10,
    color: colors.secondary,
    marginBottom: 3},

  gpa: {
    fontSize: 10,
    color: colors.text,
    fontStyle: 'italic'},

  // Skills Styles
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6},

  skillChip: {
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 6,
    border: `1px solid ${colors.border}`},

  skillText: {
    fontSize: 10,
    color: colors.text,
    fontWeight: 'medium'},

  // Languages Styles
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12},

  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4},

  languageName: {
    fontSize: 11,
    fontWeight: 'medium',
    color: colors.text,
    marginRight: 4},

  languageLevel: {
    fontSize: 10,
    color: colors.secondary,
    fontStyle: 'italic'},

  // Demographics Styles
  demographicsInfo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10},

  demographicItem: {
    fontSize: 9,
    color: colors.secondary,
    fontStyle: 'italic'}})