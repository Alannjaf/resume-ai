import { StyleSheet } from '@react-pdf/renderer'

export const sectionStyles = StyleSheet.create({
  // Main content layout
  mainContent: {
    flexDirection: 'row',
    gap: 25,
    marginTop: 20},

  leftSide: {
    width: '35%'},

  rightSide: {
    width: '65%'},

  // Section containers
  section: {
    marginBottom: 20},

  sectionTitleContainer: {
    marginBottom: 15,
    position: 'relative'},

  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8},

  sectionUnderline: {
    width: 40,
    height: 3,
    backgroundColor: '#3b82f6',
    borderRadius: 2},

  // Summary section
  summary: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
    textAlign: 'justify',
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 8,
    border: '1px solid #e2e8f0'},

  // Experience styles
  experienceItem: {
    marginBottom: 20,
    paddingBottom: 18,
    borderBottom: '1px solid #e2e8f0',
    breakInside: 'avoid',
    keepTogether: true},

  experienceHeader: {
    marginBottom: 10},

  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4},

  company: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: 'bold',
    marginBottom: 2},

  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8},

  location: {
    fontSize: 10,
    color: '#64748b'},

  duration: {
    fontSize: 10,
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    padding: '4 8',
    borderRadius: 4},

  description: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#374151',
    textAlign: 'justify'}})