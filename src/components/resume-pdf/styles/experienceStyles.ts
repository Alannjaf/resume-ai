import { StyleSheet } from '@react-pdf/renderer'

export const experienceStyles = StyleSheet.create({
  // Experience Section
  experienceItem: {
    marginBottom: 18,
    paddingBottom: 16,
    borderBottom: '1px solid #e5e7eb',
    breakInside: 'avoid', // Keep experience group together
    keepTogether: true,   // Ensure all parts stay as one unit
  },
  
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  jobTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3,
  },
  
  company: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  
  jobLocation: {
    fontSize: 10,
    color: '#6b7280',
  },
  
  duration: {
    fontSize: 10,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '4 8',
    borderRadius: 4,
  },
  
  description: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#4b5563',
    textAlign: 'justify',
    marginTop: 6,
  },
  
  // Education Section
  educationItem: {
    marginBottom: 14,
    padding: '12 16',
    backgroundColor: '#ffffff',
    borderRadius: 6,
    border: '1px solid #e5e7eb',
  },
  
  degree: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3,
  },
  
  fieldOfStudy: {
    fontSize: 11,
    color: '#6366f1',
    marginBottom: 2,
  },
  
  school: {
    fontSize: 10,
    color: '#374151',
    marginBottom: 4,
  },
  
  educationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 9,
    color: '#6b7280',
  },
  
  gpa: {
    fontSize: 9,
    color: '#059669',
    fontWeight: 'bold',
    marginTop: 2,
  },
})