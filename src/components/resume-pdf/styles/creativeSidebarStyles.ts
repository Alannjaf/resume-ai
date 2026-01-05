import { StyleSheet } from '@react-pdf/renderer'

export const sidebarStyles = StyleSheet.create({
  // Skills section
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8},

  skillChip: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    fontSize: 9,
    padding: '5 10',
    borderRadius: 12,
    fontWeight: 'bold'},

  // Education section
  educationItem: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    border: '1px solid #e2e8f0',
    breakInside: 'avoid',
    keepTogether: true},

  degree: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3},

  field: {
    fontSize: 10,
    color: '#3b82f6',
    marginBottom: 3},

  school: {
    fontSize: 10,
    color: '#64748b',
    marginBottom: 6},

  educationMeta: {
    fontSize: 9,
    color: '#94a3b8',
    marginBottom: 4},

  gpa: {
    fontSize: 9,
    color: '#059669',
    fontWeight: 'bold',
    marginBottom: 6},

  achievements: {
    fontSize: 9,
    color: '#4b5563',
    marginTop: 6,
    lineHeight: 1.4,
    fontStyle: 'italic'},

  // Languages section
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    padding: '6 0',
    borderBottom: '1px solid #f1f5f9'},

  languageName: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold'},

  languageLevel: {
    fontSize: 9,
    color: '#64748b',
    backgroundColor: '#f8fafc',
    padding: '2 6',
    borderRadius: 4},

  // Projects section
  projectItem: {
    marginBottom: 14,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 6,
    border: '1px solid #e2e8f0',
    breakInside: 'avoid',
    keepTogether: true},

  projectName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4},

  projectDescription: {
    fontSize: 9,
    color: '#4b5563',
    lineHeight: 1.4,
    marginBottom: 6},

  projectTech: {
    fontSize: 8,
    color: '#3b82f6',
    marginBottom: 4},

  projectLink: {
    fontSize: 8,
    color: '#059669',
    textDecoration: 'underline'},

  // Certifications section
  certificationItem: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#fffbeb',
    borderRadius: 6,
    border: '1px solid #fbbf24',
    breakInside: 'avoid',
    keepTogether: true},

  certificationName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 2},

  certificationIssuer: {
    fontSize: 9,
    color: '#a16207',
    marginBottom: 3},

  certificationDate: {
    fontSize: 8,
    color: '#78716c'}})